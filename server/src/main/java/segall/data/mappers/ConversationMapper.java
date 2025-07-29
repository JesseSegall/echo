package segall.data.mappers;

import org.springframework.jdbc.core.RowMapper;
import segall.models.Conversation;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ConversationMapper implements RowMapper<Conversation> {
    @Override
    public Conversation mapRow(ResultSet rs, int rowNum) throws SQLException {
        Conversation conversation = new Conversation();
        conversation.setId(rs.getLong("id"));
        conversation.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        conversation.setLastMessageAt(
                rs.getTimestamp("last_message_at") != null ?
                        rs.getTimestamp("last_message_at").toLocalDateTime() :
                        null
        );
        conversation.setOtherUserId(rs.getLong("other_user_id"));
        conversation.setOtherUserName(rs.getString("other_username"));
        conversation.setOtherUserImage(rs.getString("other_user_image"));
        conversation.setLastMessageText(rs.getString("last_message_text"));


        return conversation;
    }
}
