import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LanguageIcon from '@mui/icons-material/Language';
import PushPinIcon from '@mui/icons-material/PushPin';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import Xarrow from 'react-xarrows';

const ShowSteps = ({
  steps,
  selectedAPINode,
  codeView,
  aiProjectInitializationState,
  createFunctionSteps,
  handleClickStep,
  setHoveredSecondItem,
  handleRemoveStepNode,
  setIsModalOpen,
  setStepPos,
  editableStep,
  setEditableStep,
  handleDoneRenameStep
}) => {
  const [hoveredSecondItem, setHoveredSecondItemState] = useState(null);

  return (
    <>
      {steps.map((item, i) => (
        <div
          key={item.stepName}
          id={item.stepName}
          style={{
            position: 'relative',
            height: '80px',
            width: '100%',
            borderBottom: '1px solid lightgrey',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '0 30px',
            cursor: 'pointer',
            marginBottom: '25px',
            borderLeft: item.stepNo === codeView?.stepNo ? '5px solid green' : '5px solid transparent',
            backgroundColor: aiProjectInitializationState.baseAPIs.find(apiItem => apiItem?.id === selectedAPINode?.id)?.steps?.includes(item) ? 'white' : 'rgb(252, 221, 203)'
          }}
          onClick={item?.functionId ? () => createFunctionSteps(item, i) : () => handleClickStep(item, i)}
          onMouseOver={() => setHoveredSecondItemState(i)}
          onMouseLeave={() => setHoveredSecondItemState(null)}
        >
          {(i < steps.length - 1) && (
            <Xarrow
              start={item.stepName}
              end={steps[i + 1]?.stepName}
              path='grid'
              startAnchor='bottom'
              endAnchor='top'
              lineColor='#87CEEB'
              strokeWidth={2}
              showHead={false}
              gridBreak='50%'
            />
          )}
          {!editableStep && hoveredSecondItem === i && (
            <>
              <IconButton
                sx={{ position: 'absolute', left: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveStepNode(i);
                }}
              >
                <CancelIcon sx={{ color: 'red' }} />
              </IconButton>
              <IconButton
                sx={{ position: 'absolute', right: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen('step');
                  setStepPos(i);
                }}
              >
                <AddCircleIcon sx={{ color: 'green' }} />
              </IconButton>
            </>
          )}
          {editableStep?.stepNo === item?.stepNo ? (
            <input
              style={{ width: '100%', margin: '0 8px' }}
              value={editableStep.stepName}
              type='text'
              onChange={(e) => setEditableStep({ ...editableStep, stepName: e.target.value })}
            />
          ) : (
            <span style={{ textAlign: 'center' }}>
              {i + 1}. {item?.stepName}
              {item?.functionId ? '(function call)' : ''}
            </span>
          )}
          {editableStep?.stepNo !== item?.stepNo && (
            item?.type === 'global' ? (
              <LanguageIcon style={{ position: 'absolute', right: 30, color: '#284FA3' }} />
            ) : (
              <PushPinIcon style={{ position: 'absolute', right: 30, color: 'rgb(240, 114, 39)' }} />
            )
          )}
          {editableStep?.stepNo === item?.stepNo && (
            <>
              <IconButton
                sx={{ position: 'absolute', left: 0 }}
                onClick={() => setEditableStep(null)}
              >
                <CloseIcon style={{ color: 'red' }} />
              </IconButton>
              <IconButton
                sx={{ position: 'absolute', right: 0 }}
                onClick={handleDoneRenameStep}
              >
                <DoneIcon style={{ color: 'green' }} />
              </IconButton>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default ShowSteps;
