-- ============================================================================
-- BOVISION AI - Complete Database Backup
-- Database: bovision_ai
-- Generated: 2026-05-21 18:14:00
-- Version: 1.0.0
-- Description: Complete backup with schema, relationships, indexes and sample data
-- ============================================================================

-- ============================================================================
-- 1. DATABASE CREATION
-- ============================================================================

DROP DATABASE IF EXISTS bovision_ai;
CREATE DATABASE bovision_ai 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE bovision_ai;

-- ============================================================================
-- 2. TABLES CREATION
-- ============================================================================

-- ============================================================================
-- Table: users
-- Description: Stores user accounts with authentication and profile info
-- ============================================================================
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY COMMENT 'Unique user identifier (UUID)',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT 'User email address',
  name VARCHAR(255) NOT NULL COMMENT 'User full name',
  role ENUM('admin', 'user') DEFAULT 'user' COMMENT 'User role (admin or user)',
  pin_hash VARCHAR(255) COMMENT 'Hashed PIN for authentication',
  device_id VARCHAR(255) COMMENT 'Device identifier for PIN login',
  created_at BIGINT NOT NULL COMMENT 'Account creation timestamp (ms)',
  updated_at BIGINT NOT NULL COMMENT 'Last update timestamp (ms)',
  
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='User accounts and authentication';

-- ============================================================================
-- Table: devices
-- Description: Stores device information for PIN login sessions
-- ============================================================================
CREATE TABLE devices (
  id VARCHAR(36) PRIMARY KEY COMMENT 'Unique device identifier (UUID)',
  user_id VARCHAR(36) NOT NULL COMMENT 'Reference to user',
  device_id VARCHAR(255) NOT NULL UNIQUE COMMENT 'Device unique identifier',
  created_at BIGINT NOT NULL COMMENT 'Device registration timestamp (ms)',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_device_id (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Device sessions for PIN authentication';

-- ============================================================================
-- Table: animals
-- Description: Stores cattle/livestock information
-- ============================================================================
CREATE TABLE animals (
  id VARCHAR(36) PRIMARY KEY COMMENT 'Unique animal identifier (UUID)',
  user_id VARCHAR(36) NOT NULL COMMENT 'Owner user reference',
  name VARCHAR(255) NOT NULL COMMENT 'Animal name/identifier',
  breed VARCHAR(255) COMMENT 'Cattle breed (e.g., Nelore, Angus, Brahman)',
  age INT COMMENT 'Age in months',
  weight DECIMAL(10, 2) COMMENT 'Current weight in kg',
  health_score INT COMMENT 'Health score (0-100)',
  last_weight_date BIGINT COMMENT 'Last weight measurement timestamp (ms)',
  created_at BIGINT NOT NULL COMMENT 'Record creation timestamp (ms)',
  updated_at BIGINT NOT NULL COMMENT 'Last update timestamp (ms)',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_breed (breed),
  INDEX idx_health_score (health_score),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Livestock/cattle information';

-- ============================================================================
-- Table: health_records
-- Description: Stores health measurements and vital signs
-- ============================================================================
CREATE TABLE health_records (
  id VARCHAR(36) PRIMARY KEY COMMENT 'Unique record identifier (UUID)',
  animal_id VARCHAR(36) NOT NULL COMMENT 'Reference to animal',
  temperature DECIMAL(5, 2) COMMENT 'Body temperature in Celsius',
  heart_rate INT COMMENT 'Heart rate in beats per minute',
  respiratory_rate INT COMMENT 'Respiratory rate in breaths per minute',
  notes TEXT COMMENT 'Additional health notes',
  recorded_at BIGINT NOT NULL COMMENT 'Measurement timestamp (ms)',
  created_at BIGINT NOT NULL COMMENT 'Record creation timestamp (ms)',
  
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  INDEX idx_animal_id (animal_id),
  INDEX idx_recorded_at (recorded_at),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Animal health measurements and vital signs';

-- ============================================================================
-- Table: vaccinations
-- Description: Stores vaccination records and schedules
-- ============================================================================
CREATE TABLE vaccinations (
  id VARCHAR(36) PRIMARY KEY COMMENT 'Unique vaccination record identifier (UUID)',
  animal_id VARCHAR(36) NOT NULL COMMENT 'Reference to animal',
  vaccine_name VARCHAR(255) NOT NULL COMMENT 'Vaccine name (e.g., FMD, Brucellosis)',
  vaccination_date BIGINT NOT NULL COMMENT 'Vaccination date timestamp (ms)',
  next_dose_date BIGINT COMMENT 'Next dose scheduled date (ms)',
  notes TEXT COMMENT 'Vaccination notes and observations',
  created_at BIGINT NOT NULL COMMENT 'Record creation timestamp (ms)',
  
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  INDEX idx_animal_id (animal_id),
  INDEX idx_vaccine_name (vaccine_name),
  INDEX idx_vaccination_date (vaccination_date),
  INDEX idx_next_dose_date (next_dose_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Vaccination records and schedules';

-- ============================================================================
-- Table: financial
-- Description: Stores financial records (income and expenses)
-- ============================================================================
CREATE TABLE financial (
  id VARCHAR(36) PRIMARY KEY COMMENT 'Unique financial record identifier (UUID)',
  user_id VARCHAR(36) NOT NULL COMMENT 'Owner user reference',
  type ENUM('income', 'expense') NOT NULL COMMENT 'Record type (income or expense)',
  category VARCHAR(255) COMMENT 'Category (e.g., Feed, Veterinary, Sales)',
  amount DECIMAL(12, 2) NOT NULL COMMENT 'Amount in currency',
  description TEXT COMMENT 'Transaction description',
  date BIGINT NOT NULL COMMENT 'Transaction date timestamp (ms)',
  created_at BIGINT NOT NULL COMMENT 'Record creation timestamp (ms)',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_category (category),
  INDEX idx_date (date),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Financial records (income and expenses)';

-- ============================================================================
-- Table: conversations
-- Description: Stores AI assistant conversation sessions
-- ============================================================================
CREATE TABLE conversations (
  id VARCHAR(36) PRIMARY KEY COMMENT 'Unique conversation identifier (UUID)',
  user_id VARCHAR(36) NOT NULL COMMENT 'Owner user reference',
  title VARCHAR(255) COMMENT 'Conversation title/subject',
  created_at BIGINT NOT NULL COMMENT 'Conversation start timestamp (ms)',
  updated_at BIGINT NOT NULL COMMENT 'Last message timestamp (ms)',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='AI assistant conversation sessions';

-- ============================================================================
-- Table: conversation_messages
-- Description: Stores individual messages in conversations
-- ============================================================================
CREATE TABLE conversation_messages (
  id VARCHAR(36) PRIMARY KEY COMMENT 'Unique message identifier (UUID)',
  conversation_id VARCHAR(36) NOT NULL COMMENT 'Reference to conversation',
  role VARCHAR(50) NOT NULL COMMENT 'Message role (user or assistant)',
  content TEXT NOT NULL COMMENT 'Message content',
  created_at BIGINT NOT NULL COMMENT 'Message timestamp (ms)',
  
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Messages in AI assistant conversations';

-- ============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX idx_animals_user_breed ON animals(user_id, breed);
CREATE INDEX idx_health_animal_date ON health_records(animal_id, recorded_at);
CREATE INDEX idx_financial_user_type_date ON financial(user_id, type, date);
CREATE INDEX idx_vaccinations_animal_date ON vaccinations(animal_id, vaccination_date);

-- ============================================================================
-- 4. SAMPLE DATA
-- ============================================================================

-- Insert sample users
INSERT INTO users (id, email, name, role, pin_hash, device_id, created_at, updated_at) VALUES
('user-001', 'admin@bovision.ai', 'Admin User', 'admin', 'hashed_pin_123456', 'BV-00000001', 1716336000000, 1716336000000),
('user-002', 'fazenda@bovision.ai', 'João da Fazenda', 'user', 'hashed_pin_654321', 'BV-00000002', 1716336000000, 1716336000000),
('user-003', 'maria@bovision.ai', 'Maria Silva', 'user', 'hashed_pin_789012', 'BV-00000003', 1716336000000, 1716336000000);

-- Insert sample devices
INSERT INTO devices (id, user_id, device_id, created_at) VALUES
('device-001', 'user-001', 'BV-00000001', 1716336000000),
('device-002', 'user-002', 'BV-00000002', 1716336000000),
('device-003', 'user-003', 'BV-00000003', 1716336000000);

-- Insert sample animals (cattle)
INSERT INTO animals (id, user_id, name, breed, age, weight, health_score, last_weight_date, created_at, updated_at) VALUES
-- User 2 herd
('animal-001', 'user-002', 'Nelore 001', 'Nelore', 36, 450.50, 85, 1716336000000, 1716336000000, 1716336000000),
('animal-002', 'user-002', 'Nelore 002', 'Nelore', 24, 380.00, 88, 1716336000000, 1716336000000, 1716336000000),
('animal-003', 'user-002', 'Angus 001', 'Angus', 48, 520.75, 90, 1716336000000, 1716336000000, 1716336000000),
('animal-004', 'user-002', 'Brahman 001', 'Brahman', 60, 650.00, 82, 1716336000000, 1716336000000, 1716336000000),
('animal-005', 'user-002', 'Nelore 003', 'Nelore', 18, 320.25, 86, 1716336000000, 1716336000000, 1716336000000),

-- User 3 herd
('animal-006', 'user-003', 'Gir 001', 'Gir', 42, 420.00, 87, 1716336000000, 1716336000000, 1716336000000),
('animal-007', 'user-003', 'Guzerá 001', 'Guzerá', 54, 580.50, 84, 1716336000000, 1716336000000, 1716336000000),
('animal-008', 'user-003', 'Nelore 004', 'Nelore', 30, 400.75, 89, 1716336000000, 1716336000000, 1716336000000);

-- Insert sample health records
INSERT INTO health_records (id, animal_id, temperature, heart_rate, respiratory_rate, notes, recorded_at, created_at) VALUES
('health-001', 'animal-001', 38.5, 72, 24, 'Normal vitals', 1716336000000, 1716336000000),
('health-002', 'animal-001', 38.6, 70, 22, 'Healthy condition', 1716336000000, 1716336000000),
('health-003', 'animal-002', 38.4, 68, 20, 'Excellent health', 1716336000000, 1716336000000),
('health-004', 'animal-003', 38.7, 74, 26, 'Slight elevation', 1716336000000, 1716336000000),
('health-005', 'animal-004', 38.5, 72, 24, 'Normal vitals', 1716336000000, 1716336000000),
('health-006', 'animal-006', 38.6, 70, 22, 'Healthy', 1716336000000, 1716336000000),
('health-007', 'animal-007', 38.5, 72, 24, 'Good condition', 1716336000000, 1716336000000);

-- Insert sample vaccinations
INSERT INTO vaccinations (id, animal_id, vaccine_name, vaccination_date, next_dose_date, notes, created_at) VALUES
('vaccine-001', 'animal-001', 'FMD (Febre Aftosa)', 1716336000000, 1724112000000, 'Annual vaccination', 1716336000000),
('vaccine-002', 'animal-001', 'Brucellosis', 1716336000000, 1747948800000, 'Triennial vaccination', 1716336000000),
('vaccine-003', 'animal-002', 'FMD (Febre Aftosa)', 1716336000000, 1724112000000, 'Annual vaccination', 1716336000000),
('vaccine-004', 'animal-003', 'FMD (Febre Aftosa)', 1716336000000, 1724112000000, 'Annual vaccination', 1716336000000),
('vaccine-005', 'animal-004', 'Brucellosis', 1716336000000, 1747948800000, 'Triennial vaccination', 1716336000000),
('vaccine-006', 'animal-006', 'FMD (Febre Aftosa)', 1716336000000, 1724112000000, 'Annual vaccination', 1716336000000),
('vaccine-007', 'animal-007', 'Tuberculosis', 1716336000000, 1747948800000, 'Triennial vaccination', 1716336000000);

-- Insert sample financial records
INSERT INTO financial (id, user_id, type, category, amount, description, date, created_at) VALUES
-- User 2 finances
('fin-001', 'user-002', 'expense', 'Feed', 1500.00, 'Monthly feed purchase', 1716336000000, 1716336000000),
('fin-002', 'user-002', 'expense', 'Veterinary', 800.00, 'Veterinary consultation and vaccines', 1716336000000, 1716336000000),
('fin-003', 'user-002', 'income', 'Sales', 5000.00, 'Cattle sales', 1716336000000, 1716336000000),
('fin-004', 'user-002', 'expense', 'Pasture', 300.00, 'Pasture maintenance', 1716336000000, 1716336000000),
('fin-005', 'user-002', 'expense', 'Equipment', 2000.00, 'Equipment maintenance', 1716336000000, 1716336000000),
('fin-006', 'user-002', 'income', 'Milk Sales', 3500.00, 'Milk production sales', 1716336000000, 1716336000000),

-- User 3 finances
('fin-007', 'user-003', 'expense', 'Feed', 1200.00, 'Monthly feed purchase', 1716336000000, 1716336000000),
('fin-008', 'user-003', 'expense', 'Veterinary', 600.00, 'Health checkup', 1716336000000, 1716336000000),
('fin-009', 'user-003', 'income', 'Sales', 4500.00, 'Cattle sales', 1716336000000, 1716336000000),
('fin-010', 'user-003', 'expense', 'Labor', 2500.00, 'Monthly labor costs', 1716336000000, 1716336000000);

-- Insert sample conversations
INSERT INTO conversations (id, user_id, title, created_at, updated_at) VALUES
('conv-001', 'user-002', 'Recomendações de Nutrição', 1716336000000, 1716336000000),
('conv-002', 'user-002', 'Gestão de Saúde do Rebanho', 1716336000000, 1716336000000),
('conv-003', 'user-003', 'Planejamento de Vacinação', 1716336000000, 1716336000000);

-- Insert sample conversation messages
INSERT INTO conversation_messages (id, conversation_id, role, content, created_at) VALUES
('msg-001', 'conv-001', 'user', 'Qual é a melhor nutrição para meu rebanho Nelore?', 1716336000000),
('msg-002', 'conv-001', 'assistant', 'Para rebanho Nelore em pastagem, recomendo: proteína bruta 12-14%, energia 2.0-2.2 Mcal/kg, minerais balanceados...', 1716336000000),
('msg-003', 'conv-002', 'user', 'Como melhorar a saúde do meu rebanho?', 1716336000000),
('msg-004', 'conv-002', 'assistant', 'Recomendações para melhorar saúde: 1) Vacinação em dia, 2) Água de qualidade, 3) Pastagem adequada, 4) Monitoramento regular...', 1716336000000),
('msg-005', 'conv-003', 'user', 'Qual é o calendário de vacinação recomendado?', 1716336000000),
('msg-006', 'conv-003', 'assistant', 'Calendário recomendado: FMD (anual), Brucellosis (triênio), Tuberculose (triênio), Raiva (anual)...', 1716336000000);

-- ============================================================================
-- 5. VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: User Herd Summary
CREATE VIEW v_user_herd_summary AS
SELECT 
  u.id as user_id,
  u.name as user_name,
  u.email,
  COUNT(a.id) as total_animals,
  AVG(a.weight) as avg_weight,
  AVG(a.health_score) as avg_health_score,
  MIN(a.age) as min_age,
  MAX(a.age) as max_age
FROM users u
LEFT JOIN animals a ON u.id = a.user_id
GROUP BY u.id, u.name, u.email;

-- View: Financial Summary
CREATE VIEW v_financial_summary AS
SELECT 
  user_id,
  type,
  category,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount,
  MIN(amount) as min_amount,
  MAX(amount) as max_amount
FROM financial
GROUP BY user_id, type, category;

-- View: Animal Health Status
CREATE VIEW v_animal_health_status AS
SELECT 
  a.id,
  a.name,
  a.breed,
  a.health_score,
  hr.temperature,
  hr.heart_rate,
  hr.respiratory_rate,
  hr.recorded_at,
  CASE 
    WHEN a.health_score >= 85 THEN 'Excellent'
    WHEN a.health_score >= 70 THEN 'Good'
    WHEN a.health_score >= 50 THEN 'Fair'
    ELSE 'Poor'
  END as health_status
FROM animals a
LEFT JOIN health_records hr ON a.id = hr.animal_id
ORDER BY a.id, hr.recorded_at DESC;

-- ============================================================================
-- 6. STORED PROCEDURES
-- ============================================================================

-- Procedure: Get user herd statistics
DELIMITER //

CREATE PROCEDURE sp_get_user_herd_stats(IN p_user_id VARCHAR(36))
BEGIN
  SELECT 
    COUNT(*) as total_animals,
    AVG(weight) as avg_weight,
    AVG(health_score) as avg_health_score,
    MIN(age) as min_age,
    MAX(age) as max_age,
    COUNT(DISTINCT breed) as breed_count
  FROM animals
  WHERE user_id = p_user_id;
END//

-- Procedure: Get financial summary by user
CREATE PROCEDURE sp_get_financial_summary(IN p_user_id VARCHAR(36))
BEGIN
  SELECT 
    type,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount
  FROM financial
  WHERE user_id = p_user_id
  GROUP BY type;
END//

-- Procedure: Get vaccination schedule
CREATE PROCEDURE sp_get_vaccination_schedule(IN p_user_id VARCHAR(36))
BEGIN
  SELECT 
    a.name as animal_name,
    v.vaccine_name,
    v.vaccination_date,
    v.next_dose_date,
    DATEDIFF(v.next_dose_date, NOW()) as days_until_next_dose
  FROM animals a
  JOIN vaccinations v ON a.id = v.animal_id
  WHERE a.user_id = p_user_id
  ORDER BY v.next_dose_date ASC;
END//

DELIMITER ;

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- Trigger: Update animal updated_at on health record insert
DELIMITER //

CREATE TRIGGER trg_update_animal_on_health_insert
AFTER INSERT ON health_records
FOR EACH ROW
BEGIN
  UPDATE animals 
  SET updated_at = NEW.created_at 
  WHERE id = NEW.animal_id;
END//

-- Trigger: Update conversation updated_at on message insert
CREATE TRIGGER trg_update_conversation_on_message
AFTER INSERT ON conversation_messages
FOR EACH ROW
BEGIN
  UPDATE conversations 
  SET updated_at = NEW.created_at 
  WHERE id = NEW.conversation_id;
END//

DELIMITER ;

-- ============================================================================
-- 8. BACKUP METADATA
-- ============================================================================

-- Create backup info table
CREATE TABLE IF NOT EXISTS backup_info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  database_version VARCHAR(50),
  total_users INT,
  total_animals INT,
  total_health_records INT,
  total_vaccinations INT,
  total_financial_records INT,
  total_conversations INT,
  notes TEXT
);

-- Insert backup metadata
INSERT INTO backup_info (database_version, total_users, total_animals, total_health_records, total_vaccinations, total_financial_records, total_conversations, notes)
VALUES ('1.0.0', 3, 8, 7, 7, 10, 3, 'Complete backup with sample data - Ready for production');

-- ============================================================================
-- 9. PRIVILEGES AND SECURITY
-- ============================================================================

-- Create application user (uncomment and modify as needed)
-- CREATE USER 'bovision_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON bovision_ai.* TO 'bovision_app'@'localhost';
-- GRANT EXECUTE ON bovision_ai.* TO 'bovision_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================================================
-- 10. FINAL VERIFICATION
-- ============================================================================

-- Display database summary
SELECT 
  'BOVISION AI Database Backup' as title,
  '1.0.0' as version,
  NOW() as backup_time,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM animals) as total_animals,
  (SELECT COUNT(*) FROM health_records) as total_health_records,
  (SELECT COUNT(*) FROM vaccinations) as total_vaccinations,
  (SELECT COUNT(*) FROM financial) as total_financial_records,
  (SELECT COUNT(*) FROM conversations) as total_conversations;

-- ============================================================================
-- END OF BACKUP
-- ============================================================================
-- This backup includes:
-- ✅ 8 tables with complete schema
-- ✅ Relationships and foreign keys
-- ✅ Performance indexes
-- ✅ Sample data for testing
-- ✅ 3 useful views
-- ✅ 3 stored procedures
-- ✅ 2 triggers for automation
-- ✅ Backup metadata
-- 
-- To restore:
-- mysql -u root -p bovision_ai < DATABASE_BACKUP_COMPLETE.sql
-- ============================================================================
