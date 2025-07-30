import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Container } from '@chakra-ui/react';
import { useUser } from '../context/UserContext';

import ProfileHeader from './ProfileHeader';
import ProfilePhotoBio from './ProfilePhotoBio';
import SongsSection from './SongsSection';
import BandProfileTabs from './BandProfileTabs';

export default function BandProfile() {
	const { bandId } = useParams();
	const { user } = useUser();
	const navigate = useNavigate();

	const [band, setBand] = useState(null);
	const [members, setMembers] = useState([]);
	const [songs, setSongs] = useState([]);
	const [posts, setPosts] = useState([]);

	const fileInputRef = useRef();
	const [selectedFileName, setSelectedFileName] = useState('');

	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [isEditingInfo, setIsEditingInfo] = useState(false);
	const [infoValues, setInfoValues] = useState({ name: '', genre: '' });

	const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
	const [isEditingBio, setIsEditingBio] = useState(false);
	const [bioValue, setBioValue] = useState('');

	const [newPostContent, setNewPostContent] = useState('');

	useEffect(() => {
		fetch(`http://localhost:8080/api/band/${bandId}`)
			.then((r) => (r.ok ? r.json() : Promise.reject()))
			.then((b) => {
				setBand(b);
				setBioValue(b.bio || '');
				setInfoValues({ name: b.name, genre: b.genre });
			})
			.catch(() => navigate('/notFound'));
	}, [bandId, navigate]);

	useEffect(() => {
		if (!band) return;
		fetch(`http://localhost:8080/api/band/${bandId}/members`)
			.then((r) => (r.ok ? r.json() : []))
			.then(setMembers);

		fetch(`http://localhost:8080/api/band/${band.id}/songs`, {
			headers: { Authorization: user.jwt },
		})
			.then((r) => (r.ok ? r.json() : []))
			.then(setSongs);

		fetch(`http://localhost:8080/api/posts/band/${band.id}`, {
			headers: { Authorization: user.jwt },
		})
			.then((r) => (r.ok ? r.json() : []))
			.then(setPosts);
	}, [band, bandId, user]);

	const handleSaveInfo = async () => {
		const updated = { ...band, ...infoValues };
		const form = new FormData();
		form.append('band', new Blob([JSON.stringify(updated)], { type: 'application/json' }));

		const res = await fetch(`http://localhost:8080/api/band/${band.id}`, {
			method: 'PUT',
			headers: { Authorization: user.jwt },
			body: form,
		});
		if (res.ok) {
			const b = await res.json();
			setBand(b);
			setIsEditingInfo(false);
		} else {
			console.error('Failed to save band info');
		}
	};

	const handleSaveBio = async () => {
		const updated = { ...band, bio: bioValue };
		const form = new FormData();
		form.append('band', new Blob([JSON.stringify(updated)], { type: 'application/json' }));
		const res = await fetch(`http://localhost:8080/api/band/${band.id}`, {
			method: 'PUT',
			headers: { Authorization: user.jwt },
			body: form,
		});
		if (res.ok) {
			const b = await res.json();
			setBand(b);
			setIsEditingBio(false);
		} else {
			console.error('Failed to save bio');
		}
	};

	const handleSavePhoto = async () => {
		const file = fileInputRef.current.files[0];
		if (!file) return;

		const form = new FormData();
		form.append(
			'band',

			new Blob([JSON.stringify(band)], { type: 'application/json' })
		);
		form.append('photo', file);

		const res = await fetch(`http://localhost:8080/api/band/${band.id}`, {
			method: 'PUT',
			headers: {
				Authorization: user.jwt,
			},
			body: form,
		});

		if (res.ok) {
			const updated = await res.json();
			setBand(updated);
			setIsPhotoDialogOpen(false);
			setSelectedFileName('');
			fileInputRef.current.value = '';
		} else {
			const errorText = await res.text();
			console.error('Photo upload failed:', res.status, errorText);
		}
	};

	const handleUploadSong = async () => {
		const file = fileInputRef.current.files[0];
		if (!file) return;
		const form = new FormData();
		form.append('file', file);
		form.append('title', file.name);
		const res = await fetch(`http://localhost:8080/api/band/${band.id}/songs`, {
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

	const handleDeleteSong = async (id) => {
		const res = await fetch(`http://localhost:8080/api/band/${band.id}/songs/${id}`, {
			method: 'DELETE',
			headers: { Authorization: user.jwt },
		});
		if (res.ok) setSongs((s) => s.filter((x) => x.id !== id));
	};

	const handleAddPost = async () => {
		if (!newPostContent.trim()) return;
		const res = await fetch(`http://localhost:8080/api/posts/band/${band.id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: user.jwt },
			body: JSON.stringify({ body: newPostContent, bandId: band.id }),
		});
		if (res.ok) {
			const post = await res.json();
			setPosts((p) => [post, ...p]);
			setNewPostContent('');
		}
	};

	const handlePostDeleted = (id) => setPosts((p) => p.filter((x) => x.id !== id));
	const handlePostUpdated = (id, body) =>
		setPosts((p) => p.map((x) => (x.id === id ? { ...x, body } : x)));

	const handleMessageBandOwner = async () => {
		const res = await fetch(
			`http://localhost:8080/api/messages/conversations/with/${band.ownerId}`,
			{
				method: 'POST',
				headers: { Authorization: user.jwt },
			}
		);
		if (res.ok) {
			const convo = await res.json();
			navigate(`/messages?conversationId=${convo.id}`);
		}
	};
	const handleStartEditBio = () => setIsEditingBio(true);

	if (!band) return null;

	const isOwner = user.id === band.ownerId;
	console.log('Band', band);

	return (
		<Container maxW='container.md' p={6}>
			<ProfileHeader
				profileUser={band}
				isOwnProfile={isOwner}
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
				onMessageUser={handleMessageBandOwner}
			/>

			<ProfilePhotoBio
				profileUser={band}
				isOwnProfile={isOwner}
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
				isOwnProfile={isOwner}
				isEditingProfile={isEditingProfile}
				selectedFileName={selectedFileName}
				onSelectSongFile={(name) => setSelectedFileName(name)}
				onUploadSong={handleUploadSong}
				onDeleteSong={handleDeleteSong}
				fileInputRef={fileInputRef}
				uploaderImage={band.bandImgUrl}
			/>

			<BandProfileTabs
				posts={posts}
				newPostContent={newPostContent}
				setNewPostContent={setNewPostContent}
				onAddPost={handleAddPost}
				onPostDeleted={handlePostDeleted}
				onPostUpdated={handlePostUpdated}
				members={members}
				albums={songs}
				isOwnProfile={isOwner}
				profileUser={band}
			/>
		</Container>
	);
}
