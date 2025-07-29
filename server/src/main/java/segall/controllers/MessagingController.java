package segall.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import segall.domain.MessagingService;
import segall.domain.Result;
import segall.models.Conversation;
import segall.models.Message;
import segall.utils.JwtUtil;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessagingController {
    private final MessagingService service;
    private final JwtUtil jwtUtil;

    public MessagingController(MessagingService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }


    @PostMapping("/send/{recipientId}")
    public ResponseEntity<Object> sendMessage(@PathVariable Long recipientId,
                                              @RequestBody Map<String, String> request,
                                              @RequestHeader Map<String, String> headers) {

        Integer senderIdFromHeaders = jwtUtil.getUserIdFromHeaders(headers);
        if (senderIdFromHeaders == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String body = request.get("body");
        if (body == null) {
            return new ResponseEntity<>(List.of("Message body is required"), HttpStatus.BAD_REQUEST);
        }

        Result<Message> result = service.sendMessage(senderIdFromHeaders.longValue(), recipientId, body);

        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getpayload(), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
    }


    @GetMapping("/conversations")
    public ResponseEntity<Object> getUserConversations(@RequestHeader Map<String, String> headers) {

        Integer userIdFromHeaders = jwtUtil.getUserIdFromHeaders(headers);
        if (userIdFromHeaders == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<Conversation> conversations = service.getUserConversations(userIdFromHeaders.longValue());
        return new ResponseEntity<>(conversations, HttpStatus.OK);
    }


    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<Object> getConversationMessages(@PathVariable Long conversationId,
                                                          @RequestHeader Map<String, String> headers) {

        Integer userIdFromHeaders = jwtUtil.getUserIdFromHeaders(headers);
        if (userIdFromHeaders == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }


        if (!service.isUserInConversation(userIdFromHeaders.longValue(), conversationId)) {
            return new ResponseEntity<>(
                    List.of("You are not authorized to view this conversation"),
                    HttpStatus.FORBIDDEN
            );
        }

        List<Message> messages = service.getConversationMessages(conversationId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }


    @PostMapping("/conversations/with/{otherUserId}")
    public ResponseEntity<Object> getOrCreateConversation(@PathVariable Long otherUserId,
                                                          @RequestHeader Map<String, String> headers) {

        Integer userIdFromHeaders = jwtUtil.getUserIdFromHeaders(headers);
        if (userIdFromHeaders == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Conversation conversation = service.findOrCreateConversation(userIdFromHeaders.longValue(), otherUserId);
        return new ResponseEntity<>(conversation, HttpStatus.OK);
    }
    @DeleteMapping("/conversations/{conversationId}")
    public ResponseEntity<Object> leaveConversation(
            @PathVariable Long conversationId,
            @RequestHeader Map<String, String> headers
    ) {

        Integer userId = jwtUtil.getUserIdFromHeaders(headers);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        boolean removed = service.removeUserFromConversation(conversationId, userId.longValue());


        if (removed) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}