// firebase
// import { init } from 'next-firebase-auth'
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getBytes, getStorage, type StorageReference } from 'firebase/storage';

// const TWELVE_DAYS=12 * 60 * 60 * 24 * 1000

/* function fbConfig():{
	projectId: string;
	clientEmail: string;
	privateKey: string;
}|null{
	const config = process.env.FB_CONFIG?.toString()
	
	if(!config){
		return null
	}
	// const json=Buffer.from(config,"base64").toString("utf8")
	const json=Buffer.from(config,"base64").toString("utf-8")//.replace(/\\n/g, '\n')
	
	return JSON.parse(json)
} */

const firebaseClientInitConfig={
	apiKey: "AIzaSyDzNgStIPiKpaYxI1srHUss4KFtaPfHD08",
	authDomain: "gps-bus-7811f.firebaseapp.com",
	databaseURL: "https://gps-bus-7811f-default-rtdb.firebaseio.com",
	projectId: "gps-bus-7811f",
	storageBucket: "gps-bus-7811f.appspot.com",
	messagingSenderId: "977185398763",
	appId: "1:977185398763:web:e2591d30db217665f443ae",
	measurementId: "G-CHGPM1Q177"
}

/* export default function initAuth(){
	if(getApps().length<=0) initializeApp(firebaseClientInitConfig)
	
	const credential=fbConfig()
	if(!credential) return

	init({
		authPageURL: '/auth',
		appPageURL: '/',
		loginAPIEndpoint: '/api/login', // required
		logoutAPIEndpoint: '/api/logout', // required
		firebaseAdminInitConfig: { credential },
		firebaseClientInitConfig,
		cookies: {
			name: credential.projectId,
			keys: [
				process.env.COOKIE_SECRET_CURRENT,
				process.env.COOKIE_SECRET_PREVIOUS,
			],
			httpOnly: true,
			maxAge: TWELVE_DAYS,
			overwrite: true,
			path: '/',
			sameSite: 'strict',
			secure: false, // set this to false in local (non-HTTPS) development
			signed: true,
		},
	})

} */


const app = getApps().length>0 ? getApp() : initializeApp(firebaseClientInitConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const database = getDatabase(app)


const textDecoder = new TextDecoder()
export async function readStringStorageFile(ref: StorageReference):Promise<string|null>{
	const response = await getBytes(ref)
	try{
		return textDecoder.decode(response)
	}catch{
		return null
	}
}