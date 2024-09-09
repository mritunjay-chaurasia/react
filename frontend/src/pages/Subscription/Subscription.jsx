import React, { useEffect, useState } from 'react';
import './subscription.css';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import * as StripeApi from '../../api/stripe.api';
import AddCardModal from './Modal/AddCardModal';
import { useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Subscription = () => {
    const [allPlans, setAllPlans] = useState([]);
    const [addCardModalView, setAddCardModalView] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState({});

    const { userInfo } = useSelector(state => state.user);
    const { planDetails } = useSelector(state => state.subscription);
    const [purchaseConfirmation, setPurchaseConfirmation] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await StripeApi.getAllPlans();
            if (res && res.data) {
                setAllPlans(res.data)
            }
        })()
    }, [])

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan)
        if (planDetails && !planDetails.isExpired) setPurchaseConfirmation(true)
        else setAddCardModalView(true);
    }

    return (
        <div className='subscriptionPage'>
            <div className='subscriptionBox'>
                {allPlans && allPlans.length > 0 && allPlans.map((plan, i) => (
                    <div key={plan.id} className="subscription-card">
                        {i === 1 && <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                            <div style={{ width: "210px", backgroundColor: "#F07227", color: "white", fontSize: "18px", padding: "3px 10px", textAlign: "center", borderRadius: "5px", position: "absolute", top: "-15px" }}>Popular</div>
                        </div>}
                        <h2>{plan.name} {plan.id === planDetails?.planId && <span style={{ fontSize: "13px", color: planDetails?.isExpired ? "red" : "green" }}>{planDetails?.isExpired ? "Expired" : "Current Plan"}</span>}</h2>
                        <span style={{ fontSize: "18px", color: "grey" }}><del>{plan.metadata.mrp}.00</del></span>
                        <span style={{ fontSize: "24px" }}><small style={{ fontSize: "12px", fontWeight: "500" }}>$</small>{plan.price.unit_amount / 100}.00<small style={{ fontSize: "12px", fontWeight: "500" }}>/month</small></span>

                        <div style={{ display: "flex", flexDirection: "column", margin: "10px 0" }}>
                            {JSON.parse(plan.metadata.keyFeatures).map((feature, index) => (
                                <div style={{ margin: "3px 0" }}>
                                    <CheckCircleIcon fontSize='14px' sx={{ color: '#284fa3', marginRight: "3px" }} />
                                    <span key={index}>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                           className='text-capitalize'
                            variant="contained"
                            style={{
                                background: "#F07227",
                            }}
                            sx={{
                                marginTop: "auto",
                                "& .Mui-disabled": {
                                    background: "#FF7227",
                                    border: "1px solid #FF7227",
                                }
                            }}
                            onClick={() => handleSelectPlan(plan)}
                            disabled={(userInfo?.stripe_id && userInfo?.planDetails.planId && plan.price.unit_amount === 0) && (!planDetails?.isExpired)}
                        >
                            {(!userInfo.stripe_id && plan.price.unit_amount === 0) ? "Add Card" : "Select"}
                        </Button>
                    </div>
                ))}
            </div>
            <AddCardModal
                visible={addCardModalView}
                selectedPlan={selectedPlan}
                handleClose={() => setAddCardModalView(false)}
                user={true}
                setUser={() => { }}
            />

            <Dialog
                open={purchaseConfirmation}
                onClose={() => setPurchaseConfirmation(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Purchase Plan(${selectedPlan.name})`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your existing plan will become invalid. Are you sure you wish to proceed with updating your subscription?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className='text-capitalize' onClick={() => setPurchaseConfirmation(false)}>Cancel</Button>
                    <Button className='text-capitalize' onClick={() => {
                        setPurchaseConfirmation(false)
                        setAddCardModalView(true)
                    }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Subscription;
