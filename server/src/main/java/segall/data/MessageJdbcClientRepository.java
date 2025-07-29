package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import segall.data.mappers.MessageMapper;
import segall.models.Message;

import java.util.List;
import java.util.Objects;

@Repository
public class MessageJdbcClientRepository implements MessageRepository{
    private final JdbcClient jdbcClient;

    public MessageJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public List<Message> getMessagesByConversationId(Long conversationId) {
       final String sql = """
                        select m.*, u.username as sender_name, u.profile_img_url as sender_image
                        from messages m
                        join user u ON m.sender_id = u.id
                        where m.conversation_id = ?
                        order by m.sent_at;
                       """;
        return jdbcClient.sql(sql).param(conversationId).query(new MessageMapper()).list();
    }

    @Override
    public Message addMessage(Message message) {
        final String sql = """
                insert into messages (conversation_id, sender_id, body, sent_at )
                values (:conversation_id, :sender_id, :body, :sent_at)
                """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = jdbcClient.sql(sql)
                .param("conversation_id", message.getConversationId())
                .param("sender_id", message.getSenderId())
                .param("body", message.getBody())
                .param("sent_at", message.getSentAt())
                .update(keyHolder, "id");
        if(rowsAffected==0){
            return null;
        }
        message.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        return message;
    }

    @Override
    public Message getMessageById(Long id) {

        String sql = """
                    select m.*, u.username as sender_name, u.profile_img_url as sender_image
                    from messages m
                    join user u ON m.sender_id = u.id
                    where m.id = ?
                    """;
        return jdbcClient.sql(sql).param(id).query(new MessageMapper()).optional().orElse(null);
    }

    @Override
    public boolean deleteMessageById(Long id) {
        final String sql = "delete from messages where id = ?;";
        return jdbcClient.sql(sql).param(id).update()>0;
    }
}
