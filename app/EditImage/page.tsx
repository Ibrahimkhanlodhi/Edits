import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ImageEditor from "../components/ImageEditor";
import styles from "../UserButton.module.scss";

export default function Home() {
  return <>
  <ClerkProvider>
    <SignedIn>
      <div>
        <ImageEditor/>
      </div>
      
      <div className={styles['user-button-wrapper']}>
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: {
              width: '48px',
              height: '48px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          },
        }}
      />
    </div>
    </SignedIn>
     <SignedOut>
        <SignInButton />
      </SignedOut>
  </ClerkProvider>
  </>
 
}
