USE echo;

INSERT INTO `user` (
    username,
    password,
    first_name,
    last_name,
    bio,
    city,
    state,
    zip_code,
    profile_img_url,
    email,
    instrument
) VALUES
      (
          'sarah_drums',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Sarah',
          'Johnson',
          'Passionate drummer with 8 years of experience. Love rock and jazz!',
          'Nashville',
          'TN',
          '37201',
          'https://images.unsplash.com/photo-1494790108755-2616c2943e61?w=150',
          'sarah.johnson@email.com',
          'Drums'
      ),
      (
          'mike_bass',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Mike',
          'Rodriguez',
          'Bass player looking for a band to jam with. Into funk and alternative rock.',
          'Austin',
          'TX',
          '78701',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          'mike.rodriguez@email.com',
          'Bass Guitar'
      ),
      (
          'emily_keys',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Emily',
          'Chen',
          'Classically trained pianist branching into modern genres.',
          'San Francisco',
          'CA',
          '94102',
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          'emily.chen@email.com',
          'Piano'
      ),
      (
          'alex_shred',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Alex',
          'Thompson',
          'Lead guitarist with metal and prog rock background. Always down to shred!',
          'Denver',
          'CO',
          '80202',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          'alex.thompson@email.com',
          'Electric Guitar'
      ),
      (
          'jordan_vocals',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Jordan',
          'Williams',
          'Singer-songwriter with a soulful voice. Experience in R&B and indie pop.',
          'Atlanta',
          'GA',
          '30309',
          'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=150',
          'jordan.williams@email.com',
          'Vocals'
      ),
      (
          'sam_sax',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Sam',
          'Davis',
          'Saxophone player with jazz and blues experience. Also play clarinet.',
          'New Orleans',
          'LA',
          '70112',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          'sam.davis@email.com',
          'Saxophone'
      ),
      (
          'casey_violin',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Casey',
          'Miller',
          'Violinist exploring electric violin and experimental music.',
          'Portland',
          'OR',
          '97201',
          'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150',
          'casey.miller@email.com',
          'Violin'
      ),
      (
          'taylor_beats',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Taylor',
          'Garcia',
          'Producer and drummer specializing in electronic and hip-hop beats.',
          'Miami',
          'FL',
          '33101',
          'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150',
          'taylor.garcia@email.com',
          'Electronic Drums'
      ),
      (
          'riley_acoustic',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Riley',
          'Brown',
          'Acoustic guitarist and singer. Love folk, country, and indie music.',
          'Seattle',
          'WA',
          '98101',
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
          'riley.brown@email.com',
          'Acoustic Guitar'
      ),
      (
          'morgan_trumpet',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Morgan',
          'Lee',
          'Trumpet player with classical and jazz training. Looking to explore new genres.',
          'Boston',
          'MA',
          '02101',
          'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150',
          'morgan.lee@email.com',
          'Trumpet'
      );

INSERT INTO `user` (
    username,
    password,
    first_name,
    last_name,
    bio,
    city,
    state,
    zip_code,
    profile_img_url,
    email,
    instrument
) VALUES
      (
          'midnight_leader',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Marcus',
          'Stone',
          'Band leader and guitarist for Midnight Echoes',
          'Los Angeles',
          'CA',
          '90210',
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
          'marcus.stone@email.com',
          'Guitar'
      ),
      (
          'storm_captain',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Luna',
          'Rivers',
          'Founder and lead vocalist of Storm Riders',
          'Nashville',
          'TN',
          '37203',
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
          'luna.rivers@email.com',
          'Vocals'
      ),
      (
          'neon_founder',
          '$2a$12$dummy.hash.for.testing.purposes.only',
          'Zoe',
          'Bright',
          'Electronic music producer and founder of Neon Dreams',
          'Miami',
          'FL',
          '33139',
          'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150',
          'zoe.bright@email.com',
          'Synthesizer'
      );

INSERT INTO `band` (
    name,
    band_img_url,
    genre,
    bio,
    city,
    state,
    zip_code,
    needs_new_member
) VALUES
      (
          'Midnight Echoes',
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
          'Alternative Rock',
          'Dark atmospheric rock with haunting melodies and powerful vocals.',
          'Los Angeles',
          'CA',
          '90210',
          TRUE
      ),
      (
          'Storm Riders',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
          'Country Rock',
          'High-energy country rock band with roots in Nashville tradition.',
          'Nashville',
          'TN',
          '37203',
          TRUE
      ),
      (
          'Neon Dreams',
          'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300',
          'Electronic',
          'Futuristic electronic music blending synthwave with modern production.',
          'Miami',
          'FL',
          '33139',
          FALSE
      ),
      (
          'Acoustic Souls',
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300',
          'Folk',
          'Intimate acoustic performances focusing on storytelling and harmony.',
          'Portland',
          'OR',
          '97205',
          TRUE
      ),
      (
          'Jazz Underground',
          'https://images.unsplash.com/photo-1520637836862-4d197d17c735?w=300',
          'Jazz',
          'Modern jazz collective exploring experimental and traditional sounds.',
          'New York',
          'NY',
          '10001',
          TRUE
      );

INSERT INTO `band_members` (band_id, user_id, role) VALUES
                                                        ((SELECT id FROM band WHERE name = 'Midnight Echoes'), (SELECT id FROM user WHERE username = 'midnight_leader'), 'owner'),
                                                        ((SELECT id FROM band WHERE name = 'Storm Riders'), (SELECT id FROM user WHERE username = 'storm_captain'), 'owner'),
                                                        ((SELECT id FROM band WHERE name = 'Neon Dreams'), (SELECT id FROM user WHERE username = 'neon_founder'), 'owner');

INSERT INTO `band_members` (band_id, user_id, role) VALUES
                                                        ((SELECT id FROM band WHERE name = 'Midnight Echoes'), (SELECT id FROM user WHERE username = 'sarah_drums'), 'member'),
                                                        ((SELECT id FROM band WHERE name = 'Midnight Echoes'), (SELECT id FROM user WHERE username = 'mike_bass'), 'member'),
                                                        ((SELECT id FROM band WHERE name = 'Storm Riders'), (SELECT id FROM user WHERE username = 'riley_acoustic'), 'member'),
                                                        ((SELECT id FROM band WHERE name = 'Storm Riders'), (SELECT id FROM user WHERE username = 'alex_shred'), 'member'),
                                                        ((SELECT id FROM band WHERE name = 'Neon Dreams'), (SELECT id FROM user WHERE username = 'taylor_beats'), 'member'),
                                                        ((SELECT id FROM band WHERE name = 'Neon Dreams'), (SELECT id FROM user WHERE username = 'emily_keys'), 'member');

INSERT INTO `posts` (user_id, body) VALUES
                                        ((SELECT id FROM user WHERE username = 'jordan_vocals'), 'Just finished recording some new vocal tracks! Can''t wait to share them with everyone. Looking for a band to collaborate with! 🎤'),
                                        ((SELECT id FROM user WHERE username = 'sam_sax'), 'Had an amazing jazz session last night. The saxophone was singing! Anyone in New Orleans want to jam? 🎷'),
                                        ((SELECT id FROM user WHERE username = 'casey_violin'), 'Experimenting with electric violin effects. The sound possibilities are endless! 🎻⚡');

INSERT INTO `posts` (band_id, body) VALUES
                                        ((SELECT id FROM band WHERE name = 'Midnight Echoes'), 'New album in the works! Our sound is evolving and we''re excited to share what we''ve been creating in the studio. 🌙'),
                                        ((SELECT id FROM band WHERE name = 'Storm Riders'), 'Just booked our biggest venue yet! Country rock is alive and well. See you on the road! 🤠🎸');

INSERT INTO `songs` (user_id, title, file_key, file_url) VALUES
                                                             ((SELECT id FROM user WHERE username = 'jordan_vocals'), 'Midnight Serenade', 'songs/jordan_vocals/midnight_serenade.mp3', 'https://example.com/songs/midnight_serenade.mp3'),
                                                             ((SELECT id FROM user WHERE username = 'riley_acoustic'), 'Mountain Road', 'songs/riley_acoustic/mountain_road.mp3', 'https://example.com/songs/mountain_road.mp3'),
                                                             ((SELECT id FROM user WHERE username = 'sam_sax'), 'Blue Note Blues', 'songs/sam_sax/blue_note_blues.mp3', 'https://example.com/songs/blue_note_blues.mp3');

SELECT 'Users (musicians available for search):' as info;
SELECT id, username, CONCAT(first_name, ' ', last_name) as name, instrument
FROM user
WHERE id NOT IN (SELECT user_id FROM band_members WHERE role = 'owner');

SELECT 'Band owners (filtered out of search):' as info;
SELECT u.id, u.username, CONCAT(u.first_name, ' ', u.last_name) as name, u.instrument, b.name as band_name
FROM user u
         JOIN band_members bm ON u.id = bm.user_id
         JOIN band b ON bm.band_id = b.id
WHERE bm.role = 'owner';

SELECT 'Bands:' as info;
SELECT id, name, genre, city, state, needs_new_member FROM band ORDER BY id DESC LIMIT 5;