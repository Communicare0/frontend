import React from 'react';
import loginStyles from '../../styles/modules/auth/LoginForm.module.css';

function Button({ children, primary, secondary, className, ...props }) {
    let buttonClass = '';

    if (primary) {
        buttonClass = loginStyles.buttonPrimary; 
    } else if (secondary) {
        buttonClass = loginStyles.buttonSecondary;
    } else {
        buttonClass = loginStyles.buttonPrimary; 
    }

    // 외부에서 전달된 className도 적용
    if (className) {
        buttonClass = `${buttonClass} ${className}`;
    }

    return (
        <button className={buttonClass} {...props}>
            {children}
        </button>
    );
}

export default Button;