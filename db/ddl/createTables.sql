DROP TABLE IF EXISTS m_login_user;
CREATE TABLE m_login_user(
    seq_id INTEGER PRIMARY KEY AUTOINCREMENT,
    login_id TEXT UNIQUE,
    password TEXT NOT NULL,
    family_name TEXT NOT NULL,
    first_name TEXT,
    roles TEXT NOT NULL,
    delete_flg TEXT NOT NULL,
    create_user_id TEXT NOT NULL,
    create_date TEXT NOT NULL,
    modify_user_id TEXT NOT NULL,
    modify_date TEXT NOT NULL
);
CREATE INDEX m_login_user_idx ON m_login_user(login_id);


DROP TABLE IF EXISTS m_group;
CREATE TABLE m_group(
    seq_id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE,
    parent_uuid TEXT,
    level INTEGER,
    group_code TEXT,
    group_name TEXT,
    delete_flg TEXT NOT NULL,
    create_user_id TEXT NOT NULL,
    create_date TEXT NOT NULL,
    modify_user_id TEXT NOT NULL,
    modify_date TEXT NOT NULL
);
CREATE INDEX m_group_idx ON m_group(uuid);

DROP TABLE IF EXISTS t_favorites;
CREATE TABLE t_favorites(
    seq_id INTEGER PRIMARY KEY AUTOINCREMENT,
    login_id TEXT,
    group_uuid TEXT,
    create_user_id TEXT NOT NULL,
    create_date TEXT NOT NULL
);

DROP TABLE IF EXISTS t_task_bar;
CREATE TABLE t_task_bar(
    seq_id INTEGER PRIMARY KEY AUTOINCREMENT ,
    uuid TEXT UNIQUE ,
    group_uuid TEXT NOT NULL ,
    task_name TEXT ,
    progress NUMERIC DEFAULT 0.0 ,
    plan_period_from TEXT DEFAULT '1900-01-01' ,
    plan_period_to TEXT DEFAULT '1900-01-01' ,
    memo TEXT ,
    handle_color TEXT ,
    plan_color TEXT ,
    result_color TEXT ,
    delete_flg TEXT NOT NULL,
    create_user_id TEXT NOT NULL,
    create_date TEXT NOT NULL,
    modify_user_id TEXT NOT NULL,
    modify_date TEXT NOT NULL
);
CREATE INDEX t_task_bar_idx ON t_task_bar(uuid);

DROP TABLE IF EXISTS t_responsible_person;
CREATE TABLE t_responsible_person(
    seq_id INTEGER PRIMARY KEY AUTOINCREMENT ,
    group_uuid TEXT NOT NULL ,
    login_id TEXT NOT NULL,
    create_user_id TEXT NOT NULL,
    create_date TEXT NOT NULL
);
CREATE INDEX t_responsible_person_idx_login ON t_responsible_person(login_id);
CREATE INDEX t_responsible_person_idx_group ON t_responsible_person(group_uuid);


DROP TABLE IF EXISTS t_auth;
CREATE TABLE t_auth (
    seq_id INTEGER PRIMARY KEY AUTOINCREMENT ,
    login_id TEXT NOT NULL,
    group_uuid TEXT NOT NULL ,
    role TEXT NOT NULL,
    create_user_id TEXT NOT NULL,
    create_date TEXT NOT NULL
);
CREATE INDEX t_auth_idx ON t_auth(login_id);

