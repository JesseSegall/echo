import { useState } from 'react';
import { Box, HStack, VStack, Button, Text } from '@chakra-ui/react';
import PostsSection from './PostsSection';
import AudioPlayer from './AudioPlayer';
import BandMembers from './BandMembers';

export default function BandProfileTabs({
	posts,
	newPostContent = '',
	setNewPostContent,
	onAddPost,
	onPostDeleted,
	onPostUpdated,
	albums,
	members,
	isOwnProfile = false,
	onAddMember,
	onRemoveMember,
	profileUser,
	setMembers,
}) {
	const [activeTab, setActiveTab] = useState('posts');

	return (
		<Box mt={6}>
			{/* Tabs Navigation */}
			<HStack spacing={4} mb={4} borderBottom='1px solid' borderColor='gray.200' pb={2}>
				<Button
					variant={activeTab === 'posts' ? 'solid' : 'ghost'}
					colorScheme='blue'
					onClick={() => setActiveTab('posts')}
				>
					Posts
				</Button>
				<Button
					variant={activeTab === 'members' ? 'solid' : 'ghost'}
					colorScheme='blue'
					onClick={() => setActiveTab('members')}
				>
					Members
				</Button>
				<Button
					variant={activeTab === 'discography' ? 'solid' : 'ghost'}
					colorScheme='blue'
					onClick={() => setActiveTab('discography')}
				>
					Discography
				</Button>
			</HStack>

			{/* Tab Content */}
			<Box mt={4}>
				{activeTab === 'posts' && (
					<PostsSection
						posts={posts}
						isOwnProfile={isOwnProfile}
						newPostContent={newPostContent}
						setNewPostContent={setNewPostContent}
						onAddPost={onAddPost}
						onPostDeleted={onPostDeleted}
						onPostUpdated={onPostUpdated}
						profileUser={profileUser}
					/>
				)}

				{activeTab === 'members' && (
					<BandMembers
						members={members}
						isOwnProfile={isOwnProfile}
						bandId={profileUser.id}
						onAddMember={onAddMember}
						onRemoveMember={onRemoveMember}
					/>
				)}

				{activeTab === 'discography' && (
					<VStack spacing={4} align='stretch'>
						{albums && albums.length > 0 ? (
							albums.map((song) => (
								<AudioPlayer key={song.id} song={song} uploaderName={song.uploaderName} />
							))
						) : (
							<Text color='gray.500'>No tracks in discography yet.</Text>
						)}
					</VStack>
				)}
			</Box>
		</Box>
	);
}
