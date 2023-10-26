import { useSession, signIn, signOut } from "next-auth/react";

export default function index() {
  const { data: session }: any = useSession();
  if (session) {
    return (
      <>
        <img src={session.user.avatar} height={150} /> <br />
        Signed in as {session.user.email}   <br />
        Name  {session.user.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <div>Not signed in </div> 
      <div> 
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    </>
  );
}
