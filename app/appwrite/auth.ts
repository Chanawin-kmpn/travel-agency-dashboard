import { ID, OAuthProvider, Query } from 'appwrite';
import { account, appwriteConfig, database } from './client';
import { redirect } from 'react-router';

export const loginWithGoogle = async () => {
	try {
		account.createOAuth2Session(
			OAuthProvider.Google,
			`${window.location.origin}/`,
			`${window.location.origin}/404`
		);
	} catch (error) {
		console.log('loginWithGoogle', error);
	}
};

export const getUser = async () => {
	try {
		const user = await account.get();
		if (!user) return redirect('/sign-in');

		const { documents } = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[
				Query.equal('accountId', user.$id),
				Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId']),
			]
		);

		return documents.length > 0 ? documents[0] : redirect('/sign-in');
	} catch (error) {
		console.error('Error fetching user:', error);
		return null;
	}
};

export const logoutUser = async () => {
	try {
		await account.deleteSession('current');
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const getGooglePicture = async () => {
	try {
		const session = await account.getSession('current');
		const oAuthToken = session.providerAccessToken;

		if (!oAuthToken) {
			console.log('No OAuth token available');
			return null;
		}

		const response = await fetch(
			'https://people.googleapis.com/v1/people/me?personFields=photos',
			{
				headers: {
					Authorization: `Bearer ${oAuthToken}`,
				},
			}
		);

		const data = await response.json();

		const photoUrl =
			data.photos && data.photos.length > 0 ? data.photos[0].url : null;

		return photoUrl;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const storeUserData = async () => {
	try {
		const user = await account.get();
		if (!user) return null;

		const { documents } = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal('accountId', user.$id)]
		);

		if (documents.length > 0) return documents[0]; // If User Existing

		//If user not existing then create a new one

		const imageUrl = await getGooglePicture();

		const newUser = await database.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			{
				accountId: user.$id,
				email: user.email,
				name: user.name,
				imageUrl: imageUrl || '',
				joinedAt: new Date().toISOString(),
			}
		);

		return newUser;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const getExistingUser = async () => {
	try {
		const user = await account.get();
		if (!user) return null;

		const { documents } = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal('accountId', user.$id)]
		);

		if (documents.length === 0) return null;

		return documents[0];
	} catch (error) {
		console.log(error);
		return null;
	}
};
