package segall.data.mappers;

import org.springframework.jdbc.core.RowMapper;
import segall.models.Message;

import java.sql.ResultSet;
import java.sql.SQLException;

public class MessageMapper implements RowMapper<Message> {
    @Override
    public Message mapRow(ResultSet rs, int rowNum) throws SQLException {
        Message message = new Message();
        message.setId(rs.getLong("id"));
        message.setConversationId(rs.getLong("conversation_id"));
        message.setSenderId(rs.getLong("sender_id"));
        message.setBody(rs.getString("body"));
        message.setSentAt(rs.getTimestamp("sent_at").toLocalDateTime());
        message.setSenderName(rs.getString("sender_name"));
        message.setSenderImage(rs.getString("sender_image"));
        return message;
    }
}
