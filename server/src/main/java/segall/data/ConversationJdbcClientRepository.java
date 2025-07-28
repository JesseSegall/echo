package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import segall.data.mappers.ConversationMapper;
import segall.models.Conversation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class ConversationJdbcClientRepository implements ConversationRepository{
    private final JdbcClient jdbcClient;

    public ConversationJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public Conversation findOrCreateConversation(Long user1Id, Long user2Id) {
        final String sql = """
      select c.* from conversations c
      join conversation_users cu1 on c.id = cu1.conversation_id
      join conversation_users cu2 on c.id = cu2.conversation_id
      where (cu1.user_id = ? and cu2.user_id = ?)
         or (cu1.user_id = ? and cu2.user_id = ?)
      """;


        List<Conversation> existing = jdbcClient.sql(sql)
                .param(user1Id).param(user2Id)
                .param(user2Id).param(user1Id)
                .query(Conversation.class)
                .list();


        if (!existing.isEmpty()) {
            return existing.getFirst();
        }


        return createNewConversation(user1Id, user2Id);
    }


    private Conversation createNewConversation(Long user1Id, Long user2Id) {

        final String conversationSql = "insert into conversations (created_at) values (?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcClient.sql(conversationSql)
                .param(LocalDateTime.now())
                .update(keyHolder, "id");

        Long conversationId = Objects.requireNonNull(keyHolder.getKey()).longValue();


        final String usersSql = "insert into conversation_users (conversation_id, user_id) values (?, ?)";

        jdbcClient.sql(usersSql).param(conversationId).param(user1Id).update();
        jdbcClient.sql(usersSql).param(conversationId).param(user2Id).update();


        Conversation conversation = new Conversation();
        conversation.setId(conversationId);
        conversation.setCreatedAt(LocalDateTime.now());
        conversation.setLastMessageAt(null);

        return conversation;
    }

    @Override
    public Conversation getConversationById(Long id) {


        final String sql = """
                        select c.*,
                               u1.username as user1_name, u1.profile_img_url as user1_image,
                               u2.username as user2_name, u2.profile_img_url as user2_image
                        from conversations c
                        join conversation_users cu1 on c.id = cu1.conversation_id
                        join conversation_users cu2 on c.id = cu2.conversation_id
                        join user u1 on cu1.user_id = u1.id
                        join user u2 on cu2.user_id = u2.id
                        where c.id = ? and cu1.user_id < cu2.user_id
                        """;
        return jdbcClient.sql(sql).param(id).query(new ConversationMapper()).optional().orElse(null);
    }

    @Override
    public List<Conversation> getConversationsByUserId(Long userId) {
        final String sql = """
                              select c.*,
                                     cu2.user_id      as other_user_id,
                                     u.username       as other_username,
                                     u.profile_img_url as other_user_image,
                                     m.body           as last_message_text
                              from conversations c
                              join conversation_users cu1 on c.id = cu1.conversation_id
                              join conversation_users cu2 on c.id = cu2.conversation_id
                              join user u on u.id = cu2.user_id
                              left join messages m on c.last_message_at = m.sent_at
                                                  and c.id = m.conversation_id
                              where cu1.user_id = ?
                                and cu2.user_id != ?
                              order by c.last_message_at desc
                              """;

        return jdbcClient
                .sql(sql)
                .param(userId)
                .param(userId)
                .query(new ConversationMapper())
                .list();
    }

    @Override
    public boolean deleteConversationById(Long id) {
        final String sql = "delete from conversations where id = ?";
        return jdbcClient.sql(sql).param(id).update()>0;
    }
    public boolean removeUserFromConversation(Long conversationId, Long userId) {
        String sql = """
                      delete from conversation_users where conversation_id = ?
                      and user_id = ?
                      """;
        return jdbcClient
                .sql(sql)
                .param(conversationId)
                .param(userId)
                .update() > 0;
    }


    @Override
    public boolean isUserInConversation(Long userId, Long conversationId) {
        final String sql = """
                select count(*) from conversation_users
                where conversation_id = ? and user_id = ?;
                """;
        int count = jdbcClient.sql(sql)
                .param(conversationId)
                .param(userId)
                .query(Integer.class)
                .optional().orElse(0);
        return count > 0;
    }
}
