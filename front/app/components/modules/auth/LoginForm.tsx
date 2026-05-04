'use client'
import { Info, Loader2 } from 'lucide-react';
import styles from './loginForm.module.scss'
import { useAuth } from '@/hooks/useAuth';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';


function LoginForm() {
    const [email,setEmail] = useState<string>("");
    const [password, setPassword]= useState("");
    
    const {error,isLoading,login} = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter;

    const handleFormSubmission = async(e:FormEvent)=>{
        e.preventDefault();
        const success = await login({email,password});
        if(success){
            const redirect = searchParams.get("redirect");
            router.push( redirect || '/');
        }
    }
  return (
    <section className={styles.section}>
    <div className={styles.container}>
        <h2>Welcome</h2>
        <p>Signin to continue</p>
        <form onSubmit={handleFormSubmission} className={styles.form}>
            {error && <div className={styles.error}> <Info size={20}/>{error}</div>}
            <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input type="email" id='email' value={email} onChange={(e)=>setEmail(e.target.value)} disabled={isLoading} placeholder='johndoe@example.com' required/>
            </div>
            <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <input type="password" id='password' value={password} onChange={(e)=>setPassword(e.target.value)} disabled={isLoading}  required/>
            </div>
             <button type='submit' className={styles.submitButton} disabled={isLoading}>
             {isLoading ? (<><Loader2 className={styles.spinner}/> Checking ...</>): ("Sign In")}
             </button>
             <p>Dont have an account <Link href={'/'}>Sign up here</Link></p>
        </form>

    </div>
      
    </section>
  )
}

export default LoginForm

