package segall.data;

import segall.models.Message;

import java.util.List;

public interface MessageRepository {
    List<Message> getMessagesByConversationId(Long conversationId);
    Message addMessage(Message message);
    Message getMessageById(Long id);
    boolean deleteMessageById(Long id);
}
