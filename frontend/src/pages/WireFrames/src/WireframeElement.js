import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Icon from '@mui/material/Icon'; // Assuming you're using Material icons
import HoverableAnnotationWrapper from './HoverableAnnotationWrapper.js';

const WireframeElement = ({ element, onOptionChange, annotations, setAnnotations }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  // Listen for changes in radio button selections and propagate them upwards
  useEffect(() => {
    if (element.type === 'radioButton' && onOptionChange) {
      onOptionChange(element.id, selectedOption);
    }
  }, [selectedOption, element.id, onOptionChange]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Apply theme styles to your elements

  const renderElement = () => {
    switch (element.type) {
      case 'section':
        return (
          <div style={element.style}>
            {element.children?.map((child, index) => (
              <WireframeElement key={index} element={child} onOptionChange={onOptionChange} annotations={annotations} setAnnotations={setAnnotations} />
            ))}
          </div>
        );
      case 'textbox':
        return (
          <HoverableAnnotationWrapper element={element} annotations={annotations} setAnnotations={setAnnotations}>
            <input type="text" placeholder={element.placeholder} style={element.style} />
          </HoverableAnnotationWrapper>
        );

      case 'button':
        return (
          <HoverableAnnotationWrapper element={element} annotations={annotations} setAnnotations={setAnnotations}>
            <Button className='text-capitalize' style={element.style}>{element.content}</Button>
          </HoverableAnnotationWrapper>
        );

      case 'radiobutton':
      case 'radio':
        return (
          <HoverableAnnotationWrapper element={element} annotations={annotations} setAnnotations={setAnnotations}>
            <label style={element.style}>
              <input
                type="radio"
                name="paymentType" // This name should be common for radio buttons that are logically grouped
                value={element.name} // Use id or a value that uniquely identifies the radio button
                checked={selectedOption === element.id} // Check if this radio button is the selected one
                onChange={() => setSelectedOption(element.id)} // Update selected option on change
              /> {element.content}
            </label>
          </HoverableAnnotationWrapper>
        );

      case 'label':
        return (
          <HoverableAnnotationWrapper element={element} annotations={annotations} setAnnotations={setAnnotations}>
            <label style={element.style}>{element.content}</label>
          </HoverableAnnotationWrapper>
        );
      case 'dropdown':
        return (
          <HoverableAnnotationWrapper element={element} annotations={annotations} setAnnotations={setAnnotations}>
            <select style={element.style} onChange={(e) => setSelectedOption(e.target.value)} value={selectedOption}>
              {element.options.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </select>
          </HoverableAnnotationWrapper>
        );
      case 'text':
        return (
          <HoverableAnnotationWrapper element={element} annotations={annotations} setAnnotations={setAnnotations}>
            <div style={element.style}>{element.content}</div>
          </HoverableAnnotationWrapper>
        );

      case 'image':
        return <img src={element.source} alt="" style={element.style} />
      case 'slider':
        return <Slider defaultValue={element.value || element.min} min={element.min} max={element.max} style={element.style} />

      case 'switch':
        return <Switch checked={selectedOption === 'on'} onChange={(e) => setSelectedOption(e.target.checked ? 'on' : 'off')} style={element.style} />

      case 'icon':
        // Assuming you have a way to map `element.iconName` to actual icons
        return <Icon style={element.style}>{element.iconName}</Icon>

      // Add more complex form elements as needed

      default:
        return null;
    }
  };

  // Conditional rendering logic here, if necessary
  // For simplicity in this example, it's not demonstrated

  return renderElement();
};

export default WireframeElement;
