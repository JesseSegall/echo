package segall.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.springframework.stereotype.Service;
import segall.data.ConversationJdbcClientRepository;
import segall.data.MessageJdbcClientRepository;
import segall.models.Conversation;
import segall.models.Message;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class MessagingService {

    private final MessageJdbcClientRepository messageRepository;
    private final ConversationJdbcClientRepository conversationRepository;

    public MessagingService(MessageJdbcClientRepository messageRepository, ConversationJdbcClientRepository conversationRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }

    public Result<Message> sendMessage(Long senderId, Long recipientId, String body) {
        Result<Message> result = new Result<>();

        if (body == null || body.trim().isEmpty()) {
            result.addErrorMessage("Message body cannot be empty", ResultType.INVALID);
            return result;
        }

        try {

            Conversation conversation = conversationRepository.findOrCreateConversation(senderId, recipientId);


            Message message = new Message();
            message.setConversationId(conversation.getId());
            message.setSenderId(senderId);
            message.setBody(body.trim());
            message.setSentAt(LocalDateTime.now());


            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<Message>> violations = validator.validate(message);

            if (!violations.isEmpty()) {
                for (ConstraintViolation<Message> violation : violations) {
                    result.addErrorMessage(violation.getMessage(), ResultType.INVALID);
                }
                return result;
            }


            Message savedMessage = messageRepository.addMessage(message);
            result.setpayload(savedMessage);

        } catch (Exception e) {
            result.addErrorMessage("Failed to send message", ResultType.INVALID);
        }

        return result;
    }

    // Conversation class methods

    public List<Conversation> getUserConversations(Long userId) {
        return conversationRepository.getConversationsByUserId(userId);
    }

    public Conversation getConversation(Long conversationId) {
        return conversationRepository.getConversationById(conversationId);
    }

    public Conversation findOrCreateConversation(Long user1Id, Long user2Id) {
        return conversationRepository.findOrCreateConversation(user1Id, user2Id);
    }

    public boolean deleteConversation(Long conversationId) {
        return conversationRepository.deleteConversationById(conversationId);
    }

    // Message class pass through methods
    public List<Message> getConversationMessages(Long conversationId) {
        return messageRepository.getMessagesByConversationId(conversationId);
    }

    public boolean deleteMessage(Long messageId) {
        return messageRepository.deleteMessageById(messageId);
    }
}
