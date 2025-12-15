-- PostgreSQL Schema-only Script for TESTFINAL (Production)
-- Converted from MS SQL Server, based on postgre-script.sql
-- This file contains only DDL (no data INSERTs).

-- Drop tables if exists (for clean setup)
DROP TABLE IF EXISTS VipVoucher, VipTicket, GameTicket, Maintainance, EventBooking, Vip,
                      Ticket, TicketType, Game, RunningEvent, EventTemplate, Users,
                      Images, Customer CASCADE;


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
