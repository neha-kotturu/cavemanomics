import React from 'react';
import Auth from './auth';

function Inner() {
    return (
        <div className='Test'>
            <header className = 'testHeader'>
                <h1>Test</h1>
                <button className='testButton'></button>
            </header>
        </div>
    )
} 

function Test() {
    return (  
        <Auth>
            <Inner />
        </Auth>
    );
}

export default Test;