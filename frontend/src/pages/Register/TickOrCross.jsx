
const TickOrCross = (props)=>
{
    return (
        <>
           {props.result ? <div style={{color:'grey'}}>✔️ {props.msg}</div> : <div style={{color:'black'}}>❌ {props.msg}</div>}  
        </>
    )
}
export default TickOrCross;