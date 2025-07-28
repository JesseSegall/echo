import { useState } from 'react';
import {
	Box,
	HStack,
	VStack,
	Text,
	Flex,
	Card,
	Avatar,
	Badge,
	Collapsible,
	IconButton,
	Menu,
	Textarea,
	Button,
} from '@chakra-ui/react';
import { FaHeart, FaShare, FaComment, FaEllipsisH, FaEdit, FaTrash } from 'react-icons/fa';
import Comments from './Comments';

export default function PostCard({
	post,
	profileUser,
	loggedInUser,
	onPostDeleted,
	onPostUpdated,
}) {
	const { body, createdAt, userId, bandId } = post;

	const [liked, setLiked] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(body);

	// Determine if posted by user or band grab user or band info and set author to username or band name
	const author = profileUser;
	const authorType = userId ? 'user' : 'band';

	const isOwnPost =
		loggedInUser &&
		((userId && loggedInUser.id === userId) || (bandId && loggedInUser.bandId === bandId));

	const uploadDate = createdAt
		? new Date(createdAt).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
		  })
		: '';

	const handleEditPost = () => {
		setIsEditing(true);
		setEditContent(body);
	};
	const handleSaveEdit = async () => {
		if (!editContent.trim()) return;

		try {
			const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: loggedInUser.jwt,
				},
				body: JSON.stringify({ body: editContent }),
			});

			console.log('Response in handleSaveEdit', res);

			if (res.ok) {
				console.log('Post updated successfully');
				setIsEditing(false);

				if (onPostUpdated) {
					onPostUpdated(post.id, editContent);
				}
			} else {
				console.error('Failed to update post');
			}
		} catch (error) {
			console.error('Error updating post:', error);
		}
	};
	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditContent(body);
	};

	const handleDeletePost = async () => {
		const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: loggedInUser.jwt,
			},
		});
		if (res.status >= 200 && res.status < 300) {
			console.log('Successfully deleted');

			if (onPostDeleted) {
				onPostDeleted(post.id);
			}
		} else {
			console.log('Something went wrong');
		}
	};

	return (
		<Card.Root
			overflow='hidden'
			bg='white'
			borderRadius='16px'
			boxShadow='0 2px 12px rgba(0,0,0,0.08)'
			transition='all 0.2s ease'
			_hover={{
				boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
				transform: 'translateY(-1px)',
			}}
			w='full'
			maxW='none'
			mx='auto'
			mb={4}
		>
			<Card.Body p={0}>
				{/* Header Section */}
				<Flex align='center' p={4} pb={3}>
					<Avatar.Root size='md' mr={3}>
						<Avatar.Image src={author?.profileImgUrl} />
						<Avatar.Fallback name={author?.name || author?.username} />
					</Avatar.Root>
					<VStack align='start' spacing={0} flex={1}>
						<Text fontSize='md' fontWeight='600' color='gray.700'>
							{author?.name || author?.username}
						</Text>
						<Text fontSize='sm' color='gray.500'>
							{uploadDate}
						</Text>
					</VStack>
					<HStack spacing={2}>
						<Badge
							colorPalette={authorType === 'band' ? 'purple' : 'blue'}
							variant='subtle'
							borderRadius='full'
							px={2}
							py={1}
							fontSize='xs'
						>
							{author?.instrument || authorType}
						</Badge>
						{isOwnPost && (
							<Menu.Root>
								<Menu.Trigger asChild>
									<IconButton
										aria-label='More options'
										size='sm'
										variant='ghost'
										color='gray.500'
										_hover={{ color: 'gray.700', bg: 'gray.50' }}
									>
										<FaEllipsisH />
									</IconButton>
								</Menu.Trigger>
								<Menu.Positioner>
									<Menu.Content>
										<Menu.Item
											onClick={handleEditPost}
											_hover={{ color: 'gray.700', bg: 'gray.50' }}
										>
											<HStack spacing={2}>
												<FaEdit />
												<Text>Edit Post</Text>
											</HStack>
										</Menu.Item>
										<Menu.Item
											onClick={handleDeletePost}
											color='red.500'
											_hover={{ color: 'red.700', bg: 'red.50' }}
										>
											<HStack spacing={2}>
												<FaTrash />
												<Text>Delete Post</Text>
											</HStack>
										</Menu.Item>
									</Menu.Content>
								</Menu.Positioner>
							</Menu.Root>
						)}
					</HStack>
				</Flex>

				{/* Post Body */}
				<Box px={4} pb={3}>
					{isEditing ? (
						<VStack spacing={3} align='stretch'>
							<Textarea
								value={editContent}
								onChange={(e) => setEditContent(e.target.value)}
								resize='vertical'
								minH='100px'
								bg='white'
								border='1px solid'
								borderColor='gray.300'
								borderRadius='8px'
								fontSize='md'
								_focus={{
									borderColor: 'blue.400',
									boxShadow: '0 0 0 1px blue.400',
								}}
							/>
							<HStack justify='flex-end' spacing={2}>
								<Button size='sm' variant='outline' onClick={handleCancelEdit}>
									Cancel
								</Button>
								<Button
									size='sm'
									colorScheme='blue'
									onClick={handleSaveEdit}
									isDisabled={!editContent.trim()}
								>
									Save
								</Button>
							</HStack>
						</VStack>
					) : (
						<Text fontSize='md' color='gray.800' lineHeight='1.6' whiteSpace='pre-wrap'>
							{body}
						</Text>
					)}
				</Box>
				{/* Action Buttons */}
				<Flex
					px={4}
					pb={3}
					justify='space-between'
					align='center'
					borderTop='1px solid'
					borderColor='gray.100'
					pt={3}
				>
					<HStack spacing={4}>
						<IconButton
							aria-label='Like'
							size='sm'
							variant='ghost'
							colorPalette={liked ? 'red' : 'gray'}
							color={liked ? 'red.500' : 'gray.500'}
							onClick={() => setLiked(!liked)}
							_hover={{
								color: liked ? 'red.600' : 'red.400',
								bg: liked ? 'red.50' : 'gray.50',
							}}
						>
							<FaHeart />
						</IconButton>
						<IconButton
							aria-label='Comments'
							size='sm'
							variant='ghost'
							color={showComments ? 'orange.500' : 'gray.500'}
							onClick={() => setShowComments(!showComments)}
							_hover={{
								color: showComments ? 'orange.600' : 'orange.400',
								bg: showComments ? 'orange.50' : 'gray.50',
							}}
						>
							<FaComment />
						</IconButton>
						<IconButton
							aria-label='Share'
							size='sm'
							variant='ghost'
							color='gray.500'
							_hover={{ color: 'gray.700', bg: 'gray.50' }}
						>
							<FaShare />
						</IconButton>
					</HStack>

					<HStack spacing={3} color='gray.500' fontSize='sm'>
						<Text>❤️ {post.likesCount || 0}</Text>
						<Text>💬 {post.commentsCount || 0}</Text>
					</HStack>
				</Flex>

				<Collapsible.Root open={showComments}>
					<Collapsible.Content>
						<Comments
							post={post}
							showComments={showComments}
							loggedInUser={loggedInUser}
							profileUser={profileUser}
						/>
					</Collapsible.Content>
				</Collapsible.Root>
			</Card.Body>
		</Card.Root>
	);
}
