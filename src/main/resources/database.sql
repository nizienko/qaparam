-- Table: "group"

-- DROP TABLE "group";

CREATE TABLE "group"
(
  id serial NOT NULL,
  name text NOT NULL,
  description text,
  CONSTRAINT group_pk PRIMARY KEY (id),
  CONSTRAINT name_uniq UNIQUE (name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "group"
  OWNER TO postgres;
-- Table: group_instance

-- DROP TABLE group_instance;

CREATE TABLE group_instance
(
  id serial NOT NULL,
  name text,
  group_id serial NOT NULL,
  description text,
  CONSTRAINT group_instance_pk PRIMARY KEY (id),
  CONSTRAINT group_fk_instance FOREIGN KEY (group_id)
      REFERENCES "group" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
      CONSTRAINT name_unique UNIQUE (name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE group_instance
  OWNER TO postgres;
-- Table: parameter

-- DROP TABLE parameter;

CREATE TABLE parameter
(
  id serial NOT NULL,
  group_id serial NOT NULL, -- группа параметра
  name text NOT NULL, -- имя параметра
  description text,
  CONSTRAINT parameter_pk PRIMARY KEY (id),
  CONSTRAINT group_fk_parameter FOREIGN KEY (group_id)
      REFERENCES "group" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE parameter
  OWNER TO postgres;
COMMENT ON COLUMN parameter.group_id IS 'группа параметра';
COMMENT ON COLUMN parameter.name IS 'имя параметра';

-- Table: value

-- DROP TABLE value;

CREATE TABLE value
(
  parameter_id serial NOT NULL,
  instance_id serial NOT NULL,
  value text,
  CONSTRAINT value_pk PRIMARY KEY (parameter_id, instance_id),
  CONSTRAINT instance_fk_value FOREIGN KEY (instance_id)
      REFERENCES group_instance (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT parameter_fk_value FOREIGN KEY (parameter_id)
      REFERENCES parameter (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE value
  OWNER TO postgres;
