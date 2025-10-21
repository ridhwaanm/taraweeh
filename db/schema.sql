-- Taraweeh Recordings Database Schema

-- Huffadh (Reciters) table
CREATE TABLE IF NOT EXISTS huffadh (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, city)
);

-- Media sources enum: youtube, soundcloud, direct
CREATE TABLE IF NOT EXISTS recordings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hafidh_id INTEGER NOT NULL,
    venue_id INTEGER NOT NULL,
    hijri_year INTEGER NOT NULL,
    url TEXT NOT NULL UNIQUE,
    source TEXT NOT NULL CHECK(source IN ('youtube', 'soundcloud', 'direct')),
    audio_url TEXT,
    section TEXT,
    title TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hafidh_id) REFERENCES huffadh(id) ON DELETE CASCADE,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_recordings_hafidh ON recordings(hafidh_id);
CREATE INDEX IF NOT EXISTS idx_recordings_venue ON recordings(venue_id);
CREATE INDEX IF NOT EXISTS idx_recordings_year ON recordings(hijri_year);
CREATE INDEX IF NOT EXISTS idx_recordings_source ON recordings(source);
CREATE INDEX IF NOT EXISTS idx_recordings_section ON recordings(section);
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);
