import { useState, useEffect } from 'react';
import { Box, HStack, VStack, Text, Avatar, Textarea, Button } from '@chakra-ui/react';

export default function Comments({
	post,
	showComments,
	loggedInUser,
	profileUser,
	onCommentsCountChange,
}) {
	const [newComment, setNewComment] = useState('');
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);

	// useEffect(() => {
	// 	if (showComments && post.id) {
	// 		fetchComments();
	// 	}
	// }, [showComments, post.id]);

	// useEffect(() => {
	// 	if (onCommentsCountChange) {
	// 		onCommentsCountChange(comments.length);
	// 	}
	// }, [comments.length, onCommentsCountChange]);

	const fetchComments = async () => {
		setLoading(true);
		try {
			const response = await fetch(`http://localhost:8080/api/posts/${post.id}/comments`, {
				headers: {
					Authorization: loggedInUser?.jwt,
				},
			});

			if (response.ok) {
				const commentsData = await response.json();
				setComments(commentsData);
			} else {
				console.error('Failed to fetch comments');
			}
		} catch (error) {
			console.error('Error fetching comments:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddComment = async () => {
		if (!newComment.trim()) return;

		try {
			const response = await fetch(`http://localhost:8080/api/posts/${post.id}/comments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: loggedInUser?.jwt,
				},
				body: JSON.stringify({ body: newComment }),
			});

			if (response.ok) {
				const newCommentData = await response.json();
				setComments((prevComments) => [...prevComments, newCommentData]);
				setNewComment('');
			} else {
				console.error('Failed to add comment');
			}
		} catch (error) {
			console.error('Error adding comment:', error);
		}
	};

	if (!showComments) return null;

	return (
		<Box borderTop='2px solid' borderColor='gray.100' bg='gray.50' p={4}>
			{/* Add Comment */}
			<VStack spacing={3} align='stretch'>
				<HStack spacing={3}>
					<Avatar.Root size='sm'>
						<Avatar.Image src={profileUser?.profileImgUrl} />
						<Avatar.Fallback name={profileUser?.username || 'Current User'} />
					</Avatar.Root>
					<Textarea
						placeholder='Write a comment...'
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						resize='none'
						rows={2}
						bg='white'
						border='1px solid'
						borderColor='gray.200'
						borderRadius='8px'
						fontSize='sm'
						_focus={{
							borderColor: 'orange.400',
							boxShadow: '0 0 0 1px orange.400',
						}}
					/>
					<Button
						size='sm'
						colorPalette='orange'
						variant='solid'
						onClick={handleAddComment}
						isDisabled={!newComment.trim()}
					>
						Post
					</Button>
				</HStack>

				{/* Comments List */}
				{loading ? (
					<Text fontSize='sm' color='gray.500' textAlign='center'>
						Loading comments...
					</Text>
				) : comments.length > 0 ? (
					<VStack spacing={3} align='stretch' mt={3}>
						{comments.map((comment) => (
							<HStack key={comment.id} align='start' spacing={3}>
								<Avatar.Root size='sm'>
									<Avatar.Image src={comment.user?.profileImgUrl || comment.band?.bandImgUrl} />
									<Avatar.Fallback name={comment.user?.username || comment.band?.name} />
								</Avatar.Root>
								<VStack align='start' spacing={1} flex={1}>
									<HStack spacing={2}>
										<Text fontSize='sm' fontWeight='600' color='gray.700'>
											{comment.user?.username || comment.band?.name}
										</Text>
										<Text fontSize='xs' color='gray.500'>
											{new Date(comment.createdAt).toLocaleDateString()}
										</Text>
									</HStack>
									<Text fontSize='sm' color='gray.800'>
										{comment.body}
									</Text>
								</VStack>
							</HStack>
						))}
					</VStack>
				) : (
					<Text fontSize='sm' color='gray.500' textAlign='center' mt={3}>
						No comments yet. Be the first to comment!
					</Text>
				)}
			</VStack>
		</Box>
	);
}
