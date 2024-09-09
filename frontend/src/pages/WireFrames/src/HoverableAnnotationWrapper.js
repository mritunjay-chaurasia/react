// HoverableAnnotationWrapper.js
import React, { useState, useEffect } from 'react';

const HoverableAnnotationWrapper = ({ children, element, annotations, setAnnotations }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [annotationText, setAnnotationText] = useState('');

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const handleAddAnnotation = () => {

        const newAnnotation = { id: Date.now(), elementId: element.id, annotationText };
        setAnnotations([...annotations, newAnnotation]);
        // setAnnotationText(''); // Reset input after adding
    };

    useEffect(() => {
        if (annotations && Array.isArray(annotations)) {
            const text = annotations.filter(annotation => annotation.elementId === element.id)
            if (text && text.length > 0) setAnnotationText(text[0].annotationText)
        }
    }, [])


    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {children}
            {isHovering && (
                <div className="annotations-container">
                    {annotations?.map((annotation) => (
                        <div key={annotation.id} className="annotation">{annotation.elementId === element.id ? annotation.text : ""}</div>
                    ))}
                    <input
                        value={annotationText}
                        onChange={(e) => setAnnotationText(e.target.value)}
                        placeholder="Add Comments"
                    />
                    <button onClick={handleAddAnnotation}>Add Comments</button>
                </div>
            )}
        </div>
    );
};

export default HoverableAnnotationWrapper;
