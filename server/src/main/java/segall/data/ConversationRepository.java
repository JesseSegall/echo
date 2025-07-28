package segall.data;

import segall.models.Conversation;

import java.util.List;

public interface ConversationRepository {
    Conversation findOrCreateConversation(Long user1Id, Long user2Id);
    Conversation getConversationById(Long id);
    List<Conversation> getConversationsByUserId(Long userId);
    boolean deleteConversationById(Long id);
}
