import { Box, VStack, Button, Text, Textarea, HStack, Heading } from '@chakra-ui/react';
import PostCard from './PostCard';
import { useUser } from '../context/UserContext';
export default function PostsSection({
	posts,
	isOwnProfile,
	newPostContent,
	setNewPostContent,
	onAddPost,
	onPostDeleted,
	onPostUpdated,
	profileUser,
}) {
	const { user: loggedInUser } = useUser();
	return (
		<Box bg='white' borderWidth='1px' borderRadius='lg' p={6} mt={6}>
			<Heading size='md' mb={4}>
				Posts
			</Heading>
			{isOwnProfile && (
				<Box border='1px solid' borderColor='gray.200' p={4} mb={4} bg='gray.50'>
					<VStack spacing={3} align='stretch'>
						<Textarea
							value={newPostContent}
							onChange={(e) => setNewPostContent(e.target.value)}
							placeholder="What's on your mind?"
						/>
						<HStack justify='flex-end'>
							<Button
								size='sm'
								colorScheme='blue'
								onClick={onAddPost}
								isDisabled={!newPostContent.trim()}
							>
								Add Post
							</Button>
						</HStack>
					</VStack>
				</Box>
			)}
			{posts.length > 0 ? (
				<VStack spacing={4} align='stretch'>
					{posts.map((post) => (
						<PostCard
							key={post.id}
							post={post}
							profileUser={profileUser}
							loggedInUser={loggedInUser}
							onPostDeleted={onPostDeleted}
							onPostUpdated={onPostUpdated}
						/>
					))}
				</VStack>
			) : (
				<Box border='2px dashed' borderColor='gray.300' p={8} textAlign='center'>
					<Text color='gray.500'>
						{isOwnProfile
							? "You haven't added any posts yet!"
							: "This user hasn't posted anything yet."}
					</Text>
				</Box>
			)}
		</Box>
	);
}
