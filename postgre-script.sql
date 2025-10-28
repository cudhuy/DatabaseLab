-- PostgreSQL Migration Script for TESTFINAL Database
-- Converted from MS SQL Server

-- Create Database (Run this separately if needed)
-- CREATE DATABASE testfinal;

-- Connect to database
-- \c testfinal

-- Drop tables if exists (for clean setup)
DROP TABLE IF EXISTS VipVoucher CASCADE;
DROP TABLE IF EXISTS VipTicket CASCADE;
DROP TABLE IF EXISTS GameTicket CASCADE;
DROP TABLE IF EXISTS Maintainance CASCADE;
DROP TABLE IF EXISTS EventBooking CASCADE;
DROP TABLE IF EXISTS Vip CASCADE;
DROP TABLE IF EXISTS Ticket CASCADE;
DROP TABLE IF EXISTS TicketType CASCADE;
DROP TABLE IF EXISTS Game CASCADE;
DROP TABLE IF EXISTS RunningEvent CASCADE;
DROP TABLE IF EXISTS EventTemplate CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Images CASCADE;
DROP TABLE IF EXISTS Customer CASCADE;

-- =============================================
-- Table: Customer
-- =============================================
CREATE TABLE Customer (
    email VARCHAR(100) PRIMARY KEY,
    name VARCHAR(50)
);

-- =============================================
-- Table: Images
-- =============================================
CREATE TABLE Images (
    url VARCHAR(255) NOT NULL,
    cloudinaryId VARCHAR(100) PRIMARY KEY
);

-- =============================================
-- Table: Users
-- =============================================
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    loginName VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'staff', 'customer'))
);

-- =============================================
-- Table: EventTemplate
-- =============================================
CREATE TABLE EventTemplate (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    description VARCHAR(300),
    imageId VARCHAR(100),
    discount INTEGER CHECK (discount >= 0 AND discount <= 100),
    CONSTRAINT FK_EventTemplate FOREIGN KEY (imageId) 
        REFERENCES Images(cloudinaryId)
);

-- =============================================
-- Table: Game
-- =============================================
CREATE TABLE Game (
    id SERIAL PRIMARY KEY,
    kind INTEGER NOT NULL CHECK (kind IN (1, 2)),
    name VARCHAR(50) DEFAULT 'Untitled',
    descript VARCHAR(300) DEFAULT 'No description',
    price INTEGER DEFAULT 0,
    imageId VARCHAR(100),
    CONSTRAINT FK_Game FOREIGN KEY (imageId) 
        REFERENCES Images(cloudinaryId)
);

-- =============================================
-- Table: Maintainance
-- =============================================
CREATE TABLE Maintainance (
    _id SERIAL PRIMARY KEY,
    gameId INTEGER,
    description VARCHAR(200),
    imageId VARCHAR(100),
    status INTEGER DEFAULT 0,
    date TIMESTAMP,
    title VARCHAR(50),
    CONSTRAINT FK_gameId FOREIGN KEY (gameId) 
        REFERENCES Game(id),
    CONSTRAINT FK_imageId FOREIGN KEY (imageId) 
        REFERENCES Images(cloudinaryId)
);

-- =============================================
-- Table: RunningEvent
-- =============================================
CREATE TABLE RunningEvent (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    description VARCHAR(300),
    discount INTEGER CHECK (discount >= 0 AND discount <= 100),
    imageId VARCHAR(100),
    startBookingTime TIMESTAMP,
    endBookingTime TIMESTAMP,
    startTime TIMESTAMP,
    endTime TIMESTAMP,
    isStop BOOLEAN DEFAULT FALSE,
    CONSTRAINT FK_RunningEvent FOREIGN KEY (imageId) 
        REFERENCES Images(cloudinaryId)
);

-- =============================================
-- Table: EventBooking
-- =============================================
CREATE TABLE EventBooking (
    email VARCHAR(100) NOT NULL,
    name VARCHAR(50),
    code VARCHAR(10) NOT NULL,
    isEmailVerify BOOLEAN DEFAULT FALSE,
    isUsed BOOLEAN DEFAULT FALSE,
    eventId INTEGER NOT NULL,
    PRIMARY KEY (email, eventId),
    CONSTRAINT FK_EventBooking FOREIGN KEY (eventId) 
        REFERENCES RunningEvent(id)
);

-- =============================================
-- Table: TicketType
-- =============================================
CREATE TABLE TicketType (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    cost INTEGER DEFAULT 0
);

-- =============================================
-- Table: Ticket
-- =============================================
CREATE TABLE Ticket (
    ticketId SERIAL PRIMARY KEY,
    type INTEGER,
    timeIn TIMESTAMP,
    timeAway TIMESTAMP,
    discount DOUBLE PRECISION,
    cost INTEGER,
    isPayed BOOLEAN DEFAULT FALSE,
    CONSTRAINT FK_Ticket FOREIGN KEY (type) 
        REFERENCES TicketType(id)
);

-- =============================================
-- Table: Vip
-- =============================================
CREATE TABLE Vip (
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(50),
    vipCode VARCHAR(10) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    point INTEGER,
    dateEnd TIMESTAMP,
    _id VARCHAR(50) PRIMARY KEY,
    userId INTEGER NOT NULL,
    qrImage VARCHAR(100),
    CONSTRAINT FK_image FOREIGN KEY (qrImage) 
        REFERENCES Images(cloudinaryId),
    CONSTRAINT FK_userId FOREIGN KEY (userId) 
        REFERENCES Users(id)
);

-- =============================================
-- Table: GameTicket
-- =============================================
CREATE TABLE GameTicket (
    ticketId INTEGER PRIMARY KEY,
    gameId INTEGER NOT NULL,
    CONSTRAINT FK_GameTicket FOREIGN KEY (ticketId) 
        REFERENCES Ticket(ticketId),
    CONSTRAINT FK_GameTicketId FOREIGN KEY (gameId) 
        REFERENCES Game(id) ON DELETE CASCADE
);

-- =============================================
-- Table: VipTicket
-- =============================================
CREATE TABLE VipTicket (
    ticketId INTEGER NOT NULL,
    vipId VARCHAR(50) NOT NULL,
    CONSTRAINT FK_ticketId FOREIGN KEY (ticketId) 
        REFERENCES Ticket(ticketId),
    CONSTRAINT FK_vipId FOREIGN KEY (vipId) 
        REFERENCES Vip(_id) ON DELETE CASCADE
);

-- =============================================
-- Table: VipVoucher
-- =============================================
CREATE TABLE VipVoucher (
    vipId VARCHAR(50) NOT NULL,
    voucherCode VARCHAR(10) PRIMARY KEY,
    discount DOUBLE PRECISION NOT NULL CHECK (discount >= 0 AND discount <= 20),
    dateEnd TIMESTAMP NOT NULL,
    CONSTRAINT FK_VipVoucher FOREIGN KEY (vipId) 
        REFERENCES Vip(_id) ON DELETE CASCADE
);

-- =============================================
-- INSERT DATA
-- =============================================

-- Insert Customer
INSERT INTO Customer (email, name) VALUES
('dfdhf@gmail.com', 'dfdjfkd'),
('dfjhfd@gmail.com', 'rkfs'),
('nmt14301@gmail.com', 'Nguyen Minh Tu'),
('tensai1431@gmail.com', 'Imposible');

-- Insert Images
INSERT INTO Images (url, cloudinaryId) VALUES
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657944407/ak1cjzvloxhjxeizdoja.png', 'ak1cjzvloxhjxeizdoja'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657686003/apd1aq0ajfnap44kdeqq.jpg', 'apd1aq0ajfnap44kdeqq'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658392979/aswrefw825szpyl1k3br.jpg', 'aswrefw825szpyl1k3br'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658220123/bglykkjdmldjdr5bg154.png', 'bglykkjdmldjdr5bg154'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658219735/c45xbi4aclg3vg1hgjfw.png', 'c45xbi4aclg3vg1hgjfw'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658393219/c92xpjgsryf8veckakva.jpg', 'c92xpjgsryf8veckakva'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657944355/cu4b8thpitg5eaew8twi.png', 'cu4b8thpitg5eaew8twi'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657683017/dqq83suhqky0akbiwfz6.jpg', 'dqq83suhqky0akbiwfz6'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658222857/e0245dvy3ekwjkazpnha.jpg', 'e0245dvy3ekwjkazpnha'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657811303/e3nepwy76wgmooimjslv.png', 'e3nepwy76wgmooimjslv'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657685814/enk11mdzcnsrypph7zsc.jpg', 'enk11mdzcnsrypph7zsc'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658394821/fbeqdamfqs95uyaanhu2.jpg', 'fbeqdamfqs95uyaanhu2'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657685476/fo4f8wvd6sobrjbmiu0k.jpg', 'fo4f8wvd6sobrjbmiu0k'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658222301/frym8uqtvnkm0tg1kidd.png', 'frym8uqtvnkm0tg1kidd'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657942657/gjeaebg1mc0nok0qmrma.png', 'gjeaebg1mc0nok0qmrma'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658394965/gpgmzn0i2vrzwx6tecpd.jpg', 'gpgmzn0i2vrzwx6tecpd'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658225346/hsjniv63hpzp8ebbyqeu.png', 'hsjniv63hpzp8ebbyqeu'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657593197/htm3ylh4ihkjmvevla76.png', 'htm3ylh4ihkjmvevla76'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657944308/is4ysrgimzomhhugbc5m.png', 'is4ysrgimzomhhugbc5m'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657611533/juzz9qehsbmi739ri8kj.jpg', 'juzz9qehsbmi739ri8kj'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657811345/jwbljdmhnnymtm6hh6ap.png', 'jwbljdmhnnymtm6hh6ap'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657944487/k4nnoir3jh7xjttllnyv.png', 'k4nnoir3jh7xjttllnyv'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658219364/kjcckgtjozhxlygwvept.jpg', 'kjcckgtjozhxlygwvept'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657811158/kvr7mogtrrkglc3fsr8l.png', 'kvr7mogtrrkglc3fsr8l'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658228540/ljjjl7rapanjfyihphi3.png', 'ljjjl7rapanjfyihphi3'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658392693/lprt830bahantq4pxy89.png', 'lprt830bahantq4pxy89'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657944389/m1cgfjzcsisnekutxid7.png', 'm1cgfjzcsisnekutxid7'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657944449/mepevoykjyocsco2woho.png', 'mepevoykjyocsco2woho'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658392748/mon9xl7ifu9imr0wvi16.png', 'mon9xl7ifu9imr0wvi16'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658392489/nt2fousnvszc76rgrexc.png', 'nt2fousnvszc76rgrexc'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657682924/oa4amunihpwzsi9lomkz.jpg', 'oa4amunihpwzsi9lomkz'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658222746/ovxvw9zkltbofw0r1sos.jpg', 'ovxvw9zkltbofw0r1sos'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658392587/p49qnfqg1xzni4kiwull.png', 'p49qnfqg1xzni4kiwull'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658225905/prpkp7txnkscwvfjohr4.png', 'prpkp7txnkscwvfjohr4'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658393343/prupbtimoqomkr08fmhm.jpg', 'prupbtimoqomkr08fmhm'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657942673/pylabpzrfls9634qhcp6.png', 'pylabpzrfls9634qhcp6'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657735195/qghgwcfq7wy2cwmmhscu.jpg', 'qghgwcfq7wy2cwmmhscu'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657685733/qmm80gung8ln9wlvfktd.jpg', 'qmm80gung8ln9wlvfktd'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658218942/qvac6hrln0bhrdh2lb4q.png', 'qvac6hrln0bhrdh2lb4q'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658292800/s9exxvvlll78nv4hylac.png', 's9exxvvlll78nv4hylac'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657822208/sqjk16gcpzm6duwdox43.png', 'sqjk16gcpzm6duwdox43'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657611914/stuiyiozaaogxymbdkig.jpg', 'stuiyiozaaogxymbdkig'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658220466/tf4drobmvuognllcglye.png', 'tf4drobmvuognllcglye'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658228505/tforvahlk4sx1sbdoum5.png', 'tforvahlk4sx1sbdoum5'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658221700/trgudd74j3lsjkilwedj.jpg', 'trgudd74j3lsjkilwedj'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658219165/u1s4dtg4qdc3buknyokh.jpg', 'u1s4dtg4qdc3buknyokh'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658394565/uvboobodji6psgz0069a.jpg', 'uvboobodji6psgz0069a'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658292527/vg3q3tcyx7lva3omwz9q.png', 'vg3q3tcyx7lva3omwz9q'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658225329/vzdg7r3i9ecklfuq6gqd.png', 'vzdg7r3i9ecklfuq6gqd'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657942830/wyafbl3gy6wiez7tmwc1.png', 'wyafbl3gy6wiez7tmwc1'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658228270/xk0no8qwn5jcptefmkna.png', 'xk0no8qwn5jcptefmkna'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657593010/xkl6cxx0sprqmj1f2owk.png', 'xkl6cxx0sprqmj1f2owk'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657685695/ya73hofhcbabev7ibpow.jpg', 'ya73hofhcbabev7ibpow'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658395110/yiq3lbnm7913csokesxh.jpg', 'yiq3lbnm7913csokesxh'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658222312/ymyrtykkyig8zvynbepp.png', 'ymyrtykkyig8zvynbepp'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658392806/yueybq2neodtcu8dyuor.png', 'yueybq2neodtcu8dyuor'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1657811228/z7injwhjzmokege5khhr.png', 'z7injwhjzmokege5khhr'),
('https://res.cloudinary.com/dokh15dkv/image/upload/v1658395261/zeogizhhunp76iicibip.png', 'zeogizhhunp76iicibip');

-- Insert EventTemplate
INSERT INTO EventTemplate (id, title, description, imageId, discount) VALUES
(18, 'Mid-autumn festival', 'Enjoy mid-autumn festival in our place', 'c92xpjgsryf8veckakva', 0),
(19, 'Hello August', 'Hello August ,we have discount 30%', 'prupbtimoqomkr08fmhm', 0);

-- Reset sequence for EventTemplate
SELECT setval('eventtemplate_id_seq', (SELECT MAX(id) FROM EventTemplate));

-- Insert Game
INSERT INTO Game (id, kind, name, descript, price, imageId) VALUES
(8, 1, 'Slides and gyms', 'Where kid can enjoy playing safely', 1, 'nt2fousnvszc76rgrexc'),
(9, 1, 'Amazing Swiming Pool', 'Enjoy every in-water activities', 20000, 'p49qnfqg1xzni4kiwull'),
(10, 1, 'Palm play ground', 'Palm play ground for some physical activities', 20000, 'lprt830bahantq4pxy89'),
(11, 1, 'Football', 'Football is very amazing activities', 20000, 'mon9xl7ifu9imr0wvi16'),
(12, 2, 'Indoor Play', 'Safe place to play', 30000, 'yueybq2neodtcu8dyuor'),
(13, 2, 'Coloring plaster', 'Coloring plaster with very cheap price', 10000, 'aswrefw825szpyl1k3br');

-- Reset sequence for Game
SELECT setval('game_id_seq', (SELECT MAX(id) FROM Game));

-- Insert Maintainance
INSERT INTO Maintainance (_id, gameId, description, imageId, status, date, title) VALUES
(15, 12, 'Need replacing', 'uvboobodji6psgz0069a', 1, '2022-07-21 09:30:05.617', 'Broken Toy'),
(16, 13, 'Many paintbrushes are bent', 'fbeqdamfqs95uyaanhu2', 0, '2022-07-21 09:13:38.017', 'Bent paintbrushes'),
(17, 11, 'Need additional balls for football playground', 'gpgmzn0i2vrzwx6tecpd', 1, '2022-07-21 09:30:14.027', 'Many balls can no longer used'),
(18, 8, 'Slide is broken', 'yiq3lbnm7913csokesxh', 0, '2022-07-21 09:18:26.340', 'Broken Slide');

-- Reset sequence for Maintainance
SELECT setval('maintainance__id_seq', (SELECT MAX(_id) FROM Maintainance));

-- Insert TicketType
INSERT INTO TicketType (id, name, cost) VALUES
(1, 'Day ticket', 100000),
(2, 'Turn Ticket', 300000),
(3, 'Game Ticket', 0);

-- Reset sequence for TicketType
SELECT setval('tickettype_id_seq', (SELECT MAX(id) FROM TicketType));

-- Insert Ticket (large dataset - showing pattern)
INSERT INTO Ticket (ticketId, type, timeIn, timeAway, discount, cost, isPayed) VALUES
(2, 2, NULL, NULL, NULL, NULL, FALSE),
(3, 3, NULL, NULL, NULL, NULL, FALSE),
(10, 3, '2022-07-13 18:04:59.643', NULL, 0, 80000, FALSE),
(11, 3, '2022-07-13 18:04:59.643', NULL, 0, 80000, FALSE),
(12, 3, '2022-07-13 18:04:59.643', NULL, 0, 80000, FALSE),
(13, 3, '2022-07-13 18:06:02.457', NULL, 0, 80000, FALSE),
(14, 3, '2022-07-13 18:06:02.457', NULL, 0, 80000, FALSE),
(15, 3, '2022-07-13 18:06:02.457', NULL, 0, 80000, FALSE),
(16, 3, '2022-07-13 18:06:16.017', NULL, 0, 80000, FALSE),
(17, 3, '2022-07-13 18:06:16.017', NULL, 0, 80000, FALSE),
(18, 3, '2022-07-13 18:06:16.017', NULL, 0, 80000, FALSE),
(19, 3, '2022-07-13 18:07:09.577', NULL, 0, 80000, FALSE),
(20, 3, '2022-07-13 18:07:09.577', '2022-07-13 19:11:31.020', 0, 80000, FALSE),
(21, 3, '2022-07-13 18:07:09.577', '2022-07-13 19:11:31.020', 0, 80000, FALSE),
(22, 3, '2022-07-13 18:07:10.967', '2022-07-13 19:11:31.020', 0, 80000, FALSE),
(23, 3, '2022-07-13 18:07:10.967', NULL, 0, 80000, FALSE),
(24, 3, '2022-07-13 18:07:10.967', NULL, 0, 80000, FALSE),
(25, 3, '2022-07-13 18:07:12.937', NULL, 0, 80000, FALSE),
(26, 3, '2022-07-13 18:07:12.937', NULL, 0, 80000, FALSE),
(27, 3, '2022-07-13 18:07:12.937', NULL, 0, 80000, FALSE),
(28, 3, '2022-07-13 18:08:44.600', NULL, 0, 80000, FALSE),
(29, 3, '2022-07-13 18:08:44.600', NULL, 0, 80000, FALSE),
(30, 3, '2022-07-13 18:08:44.600', NULL, 0, 80000, FALSE),
(31, 3, '2022-07-13 18:13:54.120', NULL, 0, 80000, FALSE),
(32, 3, '2022-07-13 18:13:54.120', NULL, 0, 80000, FALSE),
(33, 3, '2022-07-13 18:13:54.120', NULL, 0, 80000, FALSE),
(34, 2, '2022-07-13 18:39:22.083', '2022-07-13 19:12:13.813', 0, 300000, TRUE),
(35, 2, '2022-07-13 18:39:22.083', '2022-07-13 19:12:13.813', 0, 300000, TRUE),
(36, 2, '2022-07-13 18:39:22.083', '2022-07-13 19:12:13.813', 0, 300000, TRUE),
(37, 2, '2022-07-13 18:41:30.243', NULL, 0, 0, TRUE),
(38, 2, '2022-07-13 18:41:30.243', NULL, 0, 0, TRUE),
(39, 2, '2022-07-13 18:41:30.243', NULL, 0, 0, FALSE),
(43, 2, '2022-07-15 15:50:17.680', NULL, 20, 0, FALSE),
(44, 2, '2022-07-15 15:50:17.680', NULL, 20, 0, FALSE),
(45, 2, '2022-07-15 15:50:17.680', NULL, 20, 0, FALSE),
(46, 2, '2022-07-15 16:08:06.583', NULL, 20, 0, FALSE),
(47, 2, '2022-07-15 16:08:06.583', NULL, 20, 0, FALSE),
(48, 2, '2022-07-15 16:08:06.583', NULL, 20, 0, FALSE),
(49, 2, '2022-07-15 16:10:29.190', NULL, 20, 0, FALSE),
(50, 2, '2022-07-15 16:10:29.190', '2022-07-20 06:56:18.847', 20, 480000, FALSE),
(51, 2, '2022-07-15 16:10:29.190', '2022-07-20 06:56:18.847', 20, 480000, FALSE),
(52, 2, '2022-07-15 16:11:34.423', '2022-07-20 06:56:18.847', 20, 480000, FALSE),
(53, 2, '2022-07-15 16:11:34.423', '2022-07-20 06:56:18.847', 20, 480000, FALSE),
(54, 2, '2022-07-15 16:11:34.423', '2022-07-20 06:56:18.847', 20, 480000, FALSE),
(55, 2, '2022-07-15 16:12:35.733', '2022-07-20 06:56:18.847', 20, 480000, FALSE),
(56, 2, '2022-07-15 16:12:35.733', '2022-07-20 06:56:18.847', 20, 480000, FALSE),
(57, 2, '2022-07-15 16:12:35.733', '2022-07-20 06:56:18.847', 20, 480000, FALSE),
(58, 2, '2022-07-15 16:13:01.100', '2022-07-20 06:56:18.847', 20, 480000, FALSE),
(59, 2, '2022-07-15 16:13:01.100', '2022-07-20 06:56:18.847', 20, 480000, FALSE),
(60, 2, '2022-07-15 16:13:01.100', '2022-07-20 06:56:18.847', 20, 480000, FALSE),
(61, 1, '2022-07-20 03:39:34.750', '2022-07-20 06:56:18.847', 0, 100000, FALSE),
(62, 2, '2022-07-20 03:41:20.507', '2022-07-20 06:56:18.847', 0, 410000, FALSE),
(63, 2, '2022-07-20 03:41:51.477', '2022-07-20 06:56:18.847', 0, 410000, FALSE),
(64, 1, '2022-07-20 03:43:00.453', '2022-07-20 06:56:18.847', 0, 100000, FALSE),
(65, 1, '2022-07-20 03:43:00.453', '2022-07-20 06:56:18.847', 0, 100000, FALSE),
(66, 2, '2022-07-20 03:44:22.527', '2022-07-20 06:56:18.847', 0, 410000, FALSE),
(67, 2, '2022-07-20 03:44:22.527', '2022-07-20 06:56:18.847', 0, 410000, FALSE),
(68, 2, '2022-07-20 03:46:04.087', '2022-07-20 06:56:18.847', 0, 410000, FALSE),
(69, 2, '2022-07-20 03:46:04.087', '2022-07-20 06:56:18.847', 0, 410000, FALSE),
(70, 2, '2022-07-20 03:55:41.787', '2022-07-20 03:59:54.400', 0, 300000, TRUE),
(71, 2, '2022-07-20 03:55:52.280', '2022-07-20 03:59:54.400', 0, 300000, TRUE),
(72, 2, '2022-07-20 04:02:53.957', '2022-07-20 06:56:18.847', 0, 410000, FALSE),
(73, 1, '2022-07-20 04:09:21.097', '2022-07-20 04:09:32.977', 0, 100000, TRUE),
(74, 3, '2022-07-20 04:10:12.917', '2022-07-20 06:56:18.847', 0, 5, FALSE),
(75, 3, '2022-07-20 04:10:12.917', '2022-07-20 06:56:18.847', 0, 5, FALSE),
(76, 3, '2022-07-20 04:14:04.757', NULL, 0, 5, TRUE),
(77, 3, '2022-07-20 04:15:25.667', NULL, 0, 5, TRUE),
(78, 3, '2022-07-20 04:16:41.043', NULL, 0, 5, TRUE),
(79, 2, '2022-07-20 04:46:05.130', '2022-07-20 04:46:19.223', 4, 288000, TRUE),
(80, 2, '2022-07-20 04:46:05.130', '2022-07-20 04:46:19.223', 4, 288000, TRUE),
(83, 2, '2022-07-20 06:47:55.513', '2022-07-20 06:48:05.603', 20.1, 239700, TRUE),
(84, 2, '2022-07-20 06:47:55.513', '2022-07-20 06:48:05.603', 20.1, 239700, TRUE),
(85, 2, '2022-07-20 06:55:55.430', '2022-07-20 06:56:18.847', 26, 222000, FALSE),
(86, 2, '2022-07-20 06:55:55.430', '2022-07-20 06:56:18.847', 26, 222000, FALSE),
(87, 2, '2022-07-20 06:55:55.430', '2022-07-21 09:23:33.023', 26, 444000, FALSE),
(88, 1, '2022-07-21 09:23:00.107', '2022-07-21 09:23:48.650', 20, 80000, TRUE),
(89, 1, '2022-07-21 09:23:00.107', '2022-07-21 09:23:48.650', 20, 80000, TRUE),
(90, 1, '2022-07-21 09:23:00.107', '2022-07-21 09:23:48.650', 20, 80000, TRUE),
(91, 1, '2022-07-21 09:23:00.107', '2022-07-21 09:23:48.650', 20, 80000, TRUE),
(92, 1, '2022-07-21 09:23:00.107', '2022-07-21 09:23:48.650', 20, 80000, TRUE),
(93, 3, '2022-07-21 09:29:14.133', NULL, 0, 30000, TRUE),
(94, 3, '2022-07-21 09:29:14.133', NULL, 0, 30000, TRUE),
(95, 3, '2022-07-21 09:29:14.133', NULL, 0, 30000, TRUE),
(96, 3, '2022-07-21 09:29:14.133', NULL, 0, 30000, TRUE),
(97, 3, '2022-07-21 09:29:14.133', NULL, 0, 30000, TRUE),
(98, 3, '2022-07-21 09:29:22.940', NULL, 0, 10000, TRUE),
(99, 3, '2022-07-21 09:29:22.940', NULL, 0, 10000, TRUE),
(100, 3, '2022-07-21 09:29:22.940', NULL, 0, 10000, TRUE),
(101, 3, '2022-07-21 09:29:22.940', NULL, 0, 10000, TRUE),
(102, 3, '2022-07-21 09:29:22.940', NULL, 0, 10000, TRUE),
(103, 3, '2022-07-21 09:29:22.940', NULL, 0, 10000, TRUE),
(104, 3, '2022-07-21 09:29:22.940', NULL, 0, 10000, TRUE),
(105, 3, '2022-07-21 09:29:22.940', NULL, 0, 10000, TRUE),
(106, 3, '2022-07-21 09:29:22.940', NULL, 0, 10000, TRUE),
(107, 3, '2022-07-21 09:29:22.940', NULL, 0, 10000, TRUE);

-- Reset sequence for Ticket
SELECT setval('ticket_ticketid_seq', (SELECT MAX(ticketId) FROM Ticket));

-- Insert Users
INSERT INTO Users (id, loginName, password, role) VALUES
(2, 'huylee', '$2a$10$a4MMYBoqnoxrOYguTka/juCHMm/3g1DI/s3FIgQKyMbItk1IOWsMu', 'staff'),
(9, 'admintinkerbell', '$2a$10$ZcDqpMYSH.g19xplcKMRkeWpiKXvQ0ogH8RxF2LjWAKHSs.qlHANe', 'admin'),
(13, '0915272339', '$2a$10$b9v/OwsdnDlLK8NCx8yheer4VQ8J5vqhyYMhB/qCcWOdUPaMuMQ1e', 'customer'),
(14, '08843854535', '$2a$10$I8wTOHW3UmGdrrIpWOVMauC1PwitiuafcndMAM.QrBv/LjGGUr6yq', 'customer'),
(15, '0123456789', '$2a$10$/IE2lQ0eElbXIadYfepQceP/ny4tDdvndqm/QCxrjUKhsSDqxPE1S', 'customer'),
(16, '0987654321', '$2a$10$7KDup2hrMQ47fWO2yQzo6OfvfdpKdv1RfPpnpDYVOyq/zm6pWsrv2', 'customer');

-- Reset sequence for Users
SELECT setval('users_id_seq', (SELECT MAX(id) FROM Users));

-- Insert Vip
INSERT INTO Vip (email, name, vipCode, phone, point, dateEnd, _id, userId, qrImage) VALUES
('nmt14301@gmail.com', 'Nguyen Minh Tuan', '5VVYC', '0123456789', 90000, '2025-07-19 04:53:18.063', '14b745bf-67bd-415b-9a99-514cd405d81a', 15, 's9exxvvlll78nv4hylac'),
('tensai14301@gmail.com', 'Tran Van Binh', 'i2Kpu', '0987654321', 51000, '2023-07-21 09:20:59.760', '310a267d-aad4-4a45-aef2-f0b18ff8e0db', 16, 'zeogizhhunp76iicibip');

-- Insert GameTicket
INSERT INTO GameTicket (ticketId, gameId) VALUES
(93, 12),
(94, 12),
(95, 12),
(96, 12),
(97, 12),
(98, 13),
(99, 13),
(100, 13),
(101, 13),
(102, 13),
(103, 13),
(104, 13),
(105, 13),
(106, 13),
(107, 13);

-- Insert VipTicket
INSERT INTO VipTicket (ticketId, vipId) VALUES
(83, '14b745bf-67bd-415b-9a99-514cd405d81a'),
(84, '14b745bf-67bd-415b-9a99-514cd405d81a'),
(85, '14b745bf-67bd-415b-9a99-514cd405d81a'),
(86, '14b745bf-67bd-415b-9a99-514cd405d81a'),
(87, '14b745bf-67bd-415b-9a99-514cd405d81a'),
(88, '310a267d-aad4-4a45-aef2-f0b18ff8e0db'),
(89, '310a267d-aad4-4a45-aef2-f0b18ff8e0db'),
(90, '310a267d-aad4-4a45-aef2-f0b18ff8e0db'),
(91, '310a267d-aad4-4a45-aef2-f0b18ff8e0db'),
(92, '310a267d-aad4-4a45-aef2-f0b18ff8e0db');

-- Verify data
SELECT 'Customer' as table_name, COUNT(*) as row_count FROM Customer
UNION ALL
SELECT 'Images', COUNT(*) FROM Images
UNION ALL
SELECT 'Users', COUNT(*) FROM Users
UNION ALL
SELECT 'EventTemplate', COUNT(*) FROM EventTemplate
UNION ALL
SELECT 'Game', COUNT(*) FROM Game
UNION ALL
SELECT 'Maintainance', COUNT(*) FROM Maintainance
UNION ALL
SELECT 'TicketType', COUNT(*) FROM TicketType
UNION ALL
SELECT 'Ticket', COUNT(*) FROM Ticket
UNION ALL
SELECT 'Vip', COUNT(*) FROM Vip
UNION ALL
SELECT 'GameTicket', COUNT(*) FROM GameTicket
UNION ALL
SELECT 'VipTicket', COUNT(*) FROM VipTicket;

-- End of migration script