import React from 'react';
import loginStyles from '../../styles/modules/auth/Login.module.css'; 


function Input({ className, ...props }) {
    // Login.module.css의 inputBase 스타일을 기본으로 사용
    const inputClass = `${loginStyles.inputBase} ${className || ''}`;

    return (
        <input className={inputClass} {...props} />
    );
}

export default Input;

/*1*/