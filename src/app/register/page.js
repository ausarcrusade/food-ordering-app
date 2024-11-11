"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {signIn} from "next-auth/react";


export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [creatingUser, setCreatingUser] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [error, setError] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setCreatingUser(true);
        setError(false);
        setUserCreated(false);
        const response = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.ok) {
            setUserCreated(true);
          }
          else {
            setError(true);
          }
          setCreatingUser(false);
        }
    
    return (
        <section className="mt-8 text-center">
            <h1 className="text-4xl text-primary font-semibold">
                Register <br/>
            </h1>
            {!userCreated && (
                <p className="text-gray-600 mt-2 text-lg">
                    Create an account to get 30% off your first order!
                </p>
            )}
            {userCreated &&(
                <p className="mt-2 text-lg ">
                    User created successfully! <br/>
                    Now you can {" "}
                    <Link href="/login" className="underline text-green-500">Login &raquo;</Link>
                </p>
            )}
                  {error && (
                <div className="my-4 text-center">
                    An error has occurred.<br />
                    Please try again later
                </div>
            )}
            <form className="mt-8 block max-w-sm mx-auto" onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name}
                    disabled={creatingUser}
                    onChange={(event) => setName(event.target.value)} />
                <input type="email" placeholder="Email" value={email}
                    disabled={creatingUser}
                    onChange={(event) => setEmail(event.target.value)} />
                <input type="password" placeholder="Password" value={password}
                    disabled={creatingUser}
                    onChange={(event) => setPassword(event.target.value)} />
                <button type="submit" className="submit" disabled={creatingUser}>
                    Register
                </button>
                <div className="my-4 text-gray-500 text-center">
                    Or
                </div>
                <button className="flex gap-4 justify-center">
                    <Image src="/google.png" alt="" width={20} height={20} />
                    Login with Google
                </button>
            </form>

        </section>
    );
}