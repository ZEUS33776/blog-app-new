import React, { useContext } from "react"
import InputBox from "../components/input.component"
import {useForm} from "react-hook-form"
import { useRef } from "react"
import googleIcon from "../imgs/google.png"
import { Link, Navigate } from "react-router-dom"
import AnimationWrapper from "../common/page-animation"
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../App"
import { storeInSession } from "../common/session"
import { authWithGoogle } from "../common/firebase"

export default function UserAuthForm({ type }) {
   
    const { register, formState: { errors },handleSubmit } = useForm()
    const onSubmit = (data) => {
        
        let fullname = data.fullname;
        let email = data.email;
        let password = data.password;
        userAuthThroughServer({ fullname, email, password });
        console.log("fullname > "+fullname+" email > "+email+" password > "+password)
    };

    

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);
    console.log("access_token"+access_token);
    
    const userAuthThroughServer = (fullname,email,password) => {
        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        let formData = {
            fullname: fullname,
            email: email,
            password:password
        }
        axios.post('http://localhost:3000' + serverRoute, formData).then(
            ({ data }) => {
                // console.log("data: ");
                storeInSession("user", JSON.stringify(data));
                setUserAuth(data);
            } 
        )
            .catch(({ response }) => {
                toast.error(response.data.error);
                
            })
               
            }
        
    
    
    const handleGoogleAuth = (e) => {
        e.preventDefault();
        authWithGoogle().then(user => {
            let serverRoute = "/google-auth";
            let formData = {
                access_token: user.accessToken
            }
            userAuthThroughServer(serverRoute,formData)
            
        })
            .catch(err => {
                toast.error('Trouble login through google');
                return console.log(err);
        })
        
    }
    
    
    return (
        access_token?
            <Navigate to="/" />
            :
         <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
            <Toaster />
            <form id="formElement" /*ref={authForm}*/ className=" w-[80%] max-w-[400px] " onSubmit={handleSubmit(onSubmit)} >
                <h1 className="text-4xl font-gelasio capitalize text-center md-24">
                    {type=="sign-in" ? "Welcome back": "Join us now"}
                </h1>
                {
                    type!="sign-in"?
                    <InputBox
                        name="fullname"
                        type="text"
                        isRequired={true}
                        register={register}
                        placeholder="Full name"
                        icon="fi-rr-user"
                    />: ""
                        }
                        


                <InputBox
                        name="email"
                            type="text"
                            isRequired={true}
                            register={register}
                            regex={/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/}
                            errmsg="Please enter a valid email address (e.g., user@example.com)."
                        placeholder="Email"
                        icon="fi-rr-envelope"
                        />
                        {errors.email && <p className="text-red text-sm my-0" role="alert">{'*'+errors.email.message}</p>}
                       
                    <InputBox
                            name="password"
                            isRequired={true}
                            register={register}
                            type="password"
                            regex={/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/}
                            errmsg="Password must be 6-20 characters long, contain at least one digit, one lowercase letter, and one uppercase letter."
                        placeholder="Password"
                        icon="fi-rr-key"
                        />
                        {errors.password && <p className="text-red text-sm my-0" role="alert">{'*'+errors.password.message}</p>}
                    <button className="btn-dark center mt-14" type="submit" >
                        {type.replace("-"," ")}

                    </button>
                    <div className="flex mt-10 items-center gap-4 text-dark-grey font-bold">
                    <hr className="w-1/2 border-dark-grey" />
                    <p>or</p>
                    <hr  className="w-1/2 border-dark-grey"/>
                    </div>
                    <button className="btn-dark flex items-center justify-center gap-4  w-[90%] center mt-12 " onClick={handleGoogleAuth}>
                        <img src={googleIcon} className="w-5" alt="" />
                        Continue with google
                    </button>
                     {
                        type=="sign-in"?
                        <Link to="/signup" className="underline text-black text-xl ml-1 flex items-center justify-center mt-8">
                        <p> Do not have an account ? Sign up here.</p>
                        </Link>:
                        <Link to="/signin" className="underline text-black text-xl ml-1 flex items-center justify-center mt-8">

                        
                         <p>Already a member ? Sign in here.</p>
                        </Link>
                        
                    }

                    
                     

                    </form>
                    
        </section>
         </AnimationWrapper>
    )

}