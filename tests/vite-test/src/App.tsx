import { ChangeEvent } from 'react';
import { Button, Checkbox, Form, Input } from '../../../';
import { Key, LogIn, Mail, User } from 'react-feather';

import './App.css'

function App() {
    function logInput(event: ChangeEvent<HTMLInputElement>) {
        console.log(event.currentTarget.value)
    }
    return (
        <div className='absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] flex flex-col justify-center items-center gap-2'>
            <Form className='gap-2 min-w-0 max-w-xl' variant='ghost' color='black' rounded='lg' titleComponent={<h1 className='font-bold text-lg relative'>Create an account</h1>}>
                <Input bordered variant='ghost' rounded='sm' pclassName='min-w-full bg-red-900' onChange={logInput} startContent={<User className='mr-2 opacity-40'/>} type='text' autoComplete='true' label='Username' placeholder='Enter your username'/>
                <Input bordered variant='ghost' rounded='sm' pclassName='min-w-full bg-red-900' onChange={logInput} startContent={<Mail className='mr-2 opacity-40'/>} type='email' autoComplete='true' label='Email' placeholder='Enter your email address'/>
                <Input bordered variant='ghost' rounded='sm' pclassName='min-w-full bg-red-900' onChange={logInput} startContent={<Key className='mr-2 opacity-40 rotate-45'/>} type='password' autoComplete='true' label='Password' placeholder='Enter your password'/>
                <Input bordered variant='ghost' rounded='sm' pclassName='min-w-full bg-red-900' onChange={logInput} startContent={<Key className='mr-2 opacity-40 rotate-45'/>} label='Confirm Password' autoComplete='true' placeholder='Re-enter your password'/>

                <span className='mt-4 min-w-full max-w-full overflow-auto'>
                    <Checkbox rounded='sm' color='google-material-themed' variant='ghost' className='min-w-md max-w-md items-start pb-2' onChecked={console.log} labelComponent={<h1 style={{
                        transform: 'translateY(-2px)'
                    }}>By ticking this checkbox you are auto-agreeing to the current, latest & the next <a href='#' className='text-blue-500 underline'>Terms Of Serice</a>.</h1>} clickBehaviour={'all'}/>
                    <Checkbox rounded='sm' color='google-material-themed' variant='ghost' className='min-w-md max-w-md items-start pb-2' onChecked={console.log} labelComponent={<h1 style={{
                        transform: 'translateY(-2px)'
                    }}>The recommended age of using the application is 16+, By ticking the checkbox you agree that we can terminate your account temporarly/permentaly if break any of the <a href='#' className='text-blue-500 underline'>Terms Of Serice</a>, Thus you are the only one responsible for your account actions & saftey.</h1>} clickBehaviour={'all'}/>
                </span>

                <span className='inline-flex gap-2 justify-end items-center min-w-full'>
                    <Button rounded='lg' color='white' variant='ghost' className='max-w-max'>Login <LogIn className='ml-2 opacity-75'/></Button>
                    <Button rounded='lg' color='google-material-themed' variant='ghost' className='max-w-max'>Register</Button>
                </span>
            </Form>
        </div>
    )
}

export default App