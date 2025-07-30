import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Container } from '@chakra-ui/react';
import { useUser } from '../context/UserContext';

import ProfileHeader from './ProfileHeader';
import ProfilePhotoBio from './ProfilePhotoBio';
import SongsSection from './SongsSection';
import PostsSection from './PostsSection';

export default function UserProfile() {
	const { username } = useParams();
	const { user, fullUser } = useUser();
	const navigate = useNavigate();

	const [profileUser, setProfileUser] = useState(null);
	const [songs, setSongs] = useState([]);
	const [posts, setPosts] = useState([]);

	const fileInputRef = useRef();
	const [selectedFileName, setSelectedFileName] = useState('');

	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [isEditingInfo, setIsEditingInfo] = useState(false);
	const [infoValues, setInfoValues] = useState({ city: '', state: '', instrument: '' });

	const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
	const [isEditingBio, setIsEditingBio] = useState(false);
	const [bioValue, setBioValue] = useState('');

	const [newPostContent, setNewPostContent] = useState('');

	// load profile
	useEffect(() => {
		fetch(`http://localhost:8080/api/user/profile/${username}`)
			.then((r) => {
				if (!r.ok) throw new Error();
				return r.json();
			})
			.then((u) => {
				setProfileUser(u);
				setBioValue(u.bio || '');
				setInfoValues({
					city: u.city || '',
					state: u.state || '',
					instrument: u.instrument || '',
				});
			})
			.catch(() => navigate('/notFound'));
	}, [username, navigate]);

	// load songs
	useEffect(() => {
		if (!profileUser) return;
		fetch(`http://localhost:8080/api/user/${profileUser.id}/songs`, {
			headers: { Authorization: user.jwt },
		})
			.then((r) => (r.ok ? r.json() : []))
			.then(setSongs)
			.catch(() => setSongs([]));
	}, [profileUser, user]);

	// load posts
	useEffect(() => {
		if (!profileUser) return;
		fetch(`http://localhost:8080/api/posts/user/${profileUser.id}`, {
			headers: { Authorization: user.jwt },
		})
			.then((r) => (r.ok ? r.json() : []))
			.then(setPosts)
			.catch(() => setPosts([]));
	}, [profileUser, user]);

	// save info
	const handleSaveInfo = async () => {
		const res = await fetch(`http://localhost:8080/api/user/${profileUser.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: user.jwt },
			body: JSON.stringify({ ...profileUser, ...infoValues }),
		});
		if (res.ok) {
			setProfileUser((p) => ({ ...p, ...infoValues }));
			setIsEditingInfo(false);
		}
	};

	// save bio
	const handleSaveBio = async () => {
		const res = await fetch(`http://localhost:8080/api/user/${profileUser.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: user.jwt },
			body: JSON.stringify({ ...profileUser, bio: bioValue }),
		});
		if (res.ok) {
			setProfileUser((p) => ({ ...p, bio: bioValue }));
			setIsEditingBio(false);
		}
	};

	// save photo
	const handleSavePhoto = async () => {
		const photoFile = fileInputRef.current.files[0];
		if (!photoFile) return;
		const form = new FormData();
		form.append('profilePhoto', photoFile);
		const res = await fetch(`http://localhost:8080/api/user/${profileUser.id}/photo`, {
			method: 'PUT',
			headers: { Authorization: user.jwt },
			body: form,
		});
		if (res.ok) {
			const updated = await res.json();
			setProfileUser(updated);
			setIsPhotoDialogOpen(false);
			setSelectedFileName('');
			fileInputRef.current.value = '';
		}
	};

	// upload song
	const handleUploadSong = async () => {
		const file = fileInputRef.current.files[0];
		if (!file) return;
		const form = new FormData();
		form.append('file', file);
		form.append('title', file.name);
		const res = await fetch(`http://localhost:8080/api/user/${profileUser.id}/songs`, {
			method: 'POST',
			headers: { Authorization: user.jwt },
			body: form,
		});
		if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
			const newSong = await res.json();
			setSongs((s) => [...s, newSong]);
			setSelectedFileName('');
		}
	};

	// delete song
	const handleDeleteSong = async (songId) => {
		const res = await fetch(`http://localhost:8080/api/user/songs/${songId}`, {
			method: 'DELETE',
			headers: { Authorization: user.jwt },
		});
		if (res.ok) setSongs((s) => s.filter((x) => x.id !== songId));
	};

	// add post
	const handleAddPost = async () => {
		if (!newPostContent.trim()) return;
		const payload = { body: newPostContent, userId: profileUser.id, bandId: null };
		const res = await fetch(`http://localhost:8080/api/posts/user/${profileUser.id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: user.jwt },
			body: JSON.stringify(payload),
		});
		if (res.ok) {
			const post = await res.json();
			setPosts((p) => [post, ...p]);
			setNewPostContent('');
		}
	};

	// delete/update post
	const handlePostDeleted = (postId) => setPosts((post) => post.filter((x) => x.id !== postId));
	const handlePostUpdated = (postId, body) =>
		setPosts((post) => post.map((x) => (x.id === postId ? { ...x, body } : x)));

	// message
	const handleMessageUser = async () => {
		const res = await fetch(
			`http://localhost:8080/api/messages/conversations/with/${profileUser.id}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: user.jwt },
			}
		);
		if (res.ok) {
			const convo = await res.json();
			navigate(`/messages?conversationId=${convo.id}`);
		}
	};
	const handleStartEditBio = () => {
		setIsEditingBio(true);
	};

	if (!profileUser) return null;
	const isOwnProfile = user && profileUser && user.id === profileUser.id;

	return (
		<Container maxW='container.md' p={6}>
			<ProfileHeader
				profileUser={profileUser}
				isOwnProfile={isOwnProfile}
				isEditingProfile={isEditingProfile}
				isEditingInfo={isEditingInfo}
				infoValues={infoValues}
				setInfoValues={setInfoValues}
				onStartEditProfile={() => setIsEditingProfile(true)}
				onSaveProfile={() => setIsEditingProfile(false)}
				onCancelEditProfile={() => {
					setIsEditingProfile(false);
					setIsEditingInfo(false);
					setIsEditingBio(false);
				}}
				onStartEditInfo={() => setIsEditingInfo(true)}
				onSaveInfo={handleSaveInfo}
				onCancelInfo={() => setIsEditingInfo(false)}
				onMessageUser={handleMessageUser}
			/>

			<ProfilePhotoBio
				profileUser={profileUser}
				isOwnProfile={isOwnProfile}
				isEditingProfile={isEditingProfile}
				isEditingBio={isEditingBio}
				bioValue={bioValue}
				setBioValue={setBioValue}
				onStartEditBio={handleStartEditBio}
				onSaveBio={handleSaveBio}
				onCancelBio={() => setIsEditingBio(false)}
				isPhotoDialogOpen={isPhotoDialogOpen}
				onOpenPhotoDialog={() => setIsPhotoDialogOpen(true)}
				onClosePhotoDialog={() => setIsPhotoDialogOpen(false)}
				fileInputRef={fileInputRef}
				selectedFileName={selectedFileName}
				onSelectPhoto={(name) => setSelectedFileName(name)}
				onSavePhoto={handleSavePhoto}
			/>

			<SongsSection
				songs={songs}
				isOwnProfile={isOwnProfile}
				isEditingProfile={isEditingProfile}
				selectedFileName={selectedFileName}
				onSelectSongFile={(name) => setSelectedFileName(name)}
				onUploadSong={handleUploadSong}
				onDeleteSong={handleDeleteSong}
				fileInputRef={fileInputRef}
				uploaderImage={profileUser.profileImgUrl}
				loggedInUser={user}
			/>

			<PostsSection
				posts={posts}
				isOwnProfile={isOwnProfile}
				newPostContent={newPostContent}
				setNewPostContent={setNewPostContent}
				onAddPost={handleAddPost}
				onPostDeleted={handlePostDeleted}
				onPostUpdated={handlePostUpdated}
				profileUser={profileUser}
			/>
		</Container>
	);
}
