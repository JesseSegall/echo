import { Box, VStack, HStack, Text, Avatar, Button } from '@chakra-ui/react';
import { useState } from 'react';
import PostsSection from './PostsSection';
import AudioPlayer from './AudioPlayer';

const BandProfileTabs = ({
	posts,
	newPostContent = '',
	setNewPostContent,
	onAddPost,
	onPostDeleted,
	onPostUpdated,
	members,
	albums,
	isOwnProfile = false,
	profileUser,
}) => {
	const [activeTab, setActiveTab] = useState('posts');

	return (
		<Box mt={6}>
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
					<VStack spacing={4} align='stretch'>
						{members && members.length > 0 ? (
							members.map((m) => (
								<HStack key={m.userId || m.id} p={4} bg='white' borderRadius='md' boxShadow='sm'>
									<Avatar name={m.username} src={m.profileImgUrl} />
									<VStack align='start' spacing={0}>
										<Text fontWeight='bold'>{m.username}</Text>
										<Text fontSize='sm' color='gray.500'>
											{m.role}
										</Text>
									</VStack>
								</HStack>
							))
						) : (
							<Text color='gray.500'>No members yet.</Text>
						)}
					</VStack>
				)}

				{activeTab === 'discography' && (
					<VStack spacing={4} align='stretch'>
						{albums && albums.length > 0 ? (
							albums.map((song) => (
								<AudioPlayer
									key={song.id}
									song={song}
									uploaderName={song.uploaderName}
									onDelete={() => {}}
								/>
							))
						) : (
							<Text color='gray.500'>No tracks in discography yet.</Text>
						)}
					</VStack>
				)}
			</Box>
		</Box>
	);
};

export default BandProfileTabs;
