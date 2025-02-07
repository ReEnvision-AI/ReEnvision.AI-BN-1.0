SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '5266e2ca-2400-4e62-9229-79011659748c', '{"action":"user_signedup","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-12-20 00:31:34.799292+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eea29c4e-7893-4155-bfa0-168953aa1d66', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-20 00:31:34.802872+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a187a89-8527-4d97-9054-56c4eedaef82', '{"action":"user_signedup","actor_id":"60382be9-c689-40eb-8fcf-c0be1ec886a5","actor_username":"test@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-12-20 18:29:54.004438+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd67ddd79-c4d2-47c6-ab5a-423e82ff8b71', '{"action":"login","actor_id":"60382be9-c689-40eb-8fcf-c0be1ec886a5","actor_username":"test@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-20 18:29:54.007373+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b261d53-784f-4594-9b12-a2b9f69b0dec', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-27 22:54:18.865979+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfdca075-0d93-4f82-bc82-6550785f327c', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-27 23:01:14.042216+00', ''),
	('00000000-0000-0000-0000-000000000000', '87f252d8-7a9c-4127-a9cb-fec075fc4ec9', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-30 23:06:06.844059+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b555c205-22e8-4c71-b76a-d1b095c0b330', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-30 23:08:29.899407+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a3a5337-eb5e-4199-8083-5c071d237741', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-31 20:27:16.140674+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e6bf948-670d-4aaf-95be-82dc8382f6c0', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-02 17:59:00.500151+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c429e65d-c3fb-4220-b633-2c10108005e0', '{"action":"token_refreshed","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"token"}', '2025-01-07 19:14:07.490867+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c4bb458b-8b49-4ff8-99f0-5ce6e5fac4c1', '{"action":"token_revoked","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"token"}', '2025-01-07 19:14:07.492943+00', ''),
	('00000000-0000-0000-0000-000000000000', 'adf16c99-ac16-4bc8-bec3-022921483e32', '{"action":"token_refreshed","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"token"}', '2025-01-07 21:49:54.878804+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b5c4c5bf-af73-44a6-90b9-ecb615765634', '{"action":"token_revoked","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"token"}', '2025-01-07 21:49:54.883111+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ff426bb2-b8de-4b4f-9659-4fc479d5d2df', '{"action":"token_refreshed","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"token"}', '2025-01-08 20:26:46.527275+00', ''),
	('00000000-0000-0000-0000-000000000000', '3058dfc9-1afd-4477-a226-bdaefadd3a30', '{"action":"token_revoked","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"token"}', '2025-01-08 20:26:46.536124+00', ''),
	('00000000-0000-0000-0000-000000000000', '35d8ac17-e932-420b-895d-2c4f2d681e62', '{"action":"token_refreshed","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"token"}', '2025-01-09 08:11:32.069144+00', ''),
	('00000000-0000-0000-0000-000000000000', '9040154c-a3a0-4526-b4b9-2b5ed458949e', '{"action":"token_revoked","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"token"}', '2025-01-09 08:11:32.086977+00', ''),
	('00000000-0000-0000-0000-000000000000', '0e13c638-ff73-48cf-a091-03f8b35b5222', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-29 21:55:17.653469+00', ''),
	('00000000-0000-0000-0000-000000000000', '2a3ccb95-c339-47e0-89dc-7b5d5aaa36f1', '{"action":"logout","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account"}', '2025-01-29 21:55:23.198751+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec65405f-aa4b-46fb-ad89-b174fa057000', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-01 18:46:58.529115+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a1bafa5-6777-495c-a649-540a54f430fc', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-01 18:47:09.414748+00', ''),
	('00000000-0000-0000-0000-000000000000', '2d1bedc4-be8d-48bc-8dc9-eeefae933480', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-02 00:20:45.341618+00', ''),
	('00000000-0000-0000-0000-000000000000', '199dce7e-4929-4907-a391-baedcc3ac830', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-02 00:22:13.189527+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd448d9a6-5d69-42ef-81f5-4a76129983b5', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-02 00:31:22.554439+00', ''),
	('00000000-0000-0000-0000-000000000000', '24eb9fa2-9850-40cc-8b72-45d172d50e89', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-02 01:50:07.97664+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec642384-d5db-4077-ba77-dc4d307c629a', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-02 22:15:04.594937+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a5c156f4-a9f4-437d-80a8-168d8f2b7245', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-03 18:41:18.47707+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c667c14-4873-42b2-b928-debb4a122eb4', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-03 20:51:01.892809+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ff126a43-235d-4d8e-8dd2-029c274c1b88', '{"action":"user_signedup","actor_id":"4f0408f4-6151-4c6f-ad20-bf3e89a0518c","actor_username":"brad2@brad.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-02-05 06:23:04.198802+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b907001-0640-45b1-9279-3ec827738745', '{"action":"login","actor_id":"4f0408f4-6151-4c6f-ad20-bf3e89a0518c","actor_username":"brad2@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 06:23:04.208347+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b99acdfd-90b8-419b-9b1e-051e7bf6a1d5', '{"action":"logout","actor_id":"4f0408f4-6151-4c6f-ad20-bf3e89a0518c","actor_username":"brad2@brad.com","actor_via_sso":false,"log_type":"account"}', '2025-02-05 06:23:09.173469+00', ''),
	('00000000-0000-0000-0000-000000000000', '11e94670-b403-42f5-8662-9754fe846379', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 06:36:45.874814+00', ''),
	('00000000-0000-0000-0000-000000000000', '27feed42-1708-4e90-a11b-e80804281ef7', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 06:38:09.795529+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b3dc3f1-6a0d-4df4-b13c-2dd5e950415f', '{"action":"user_signedup","actor_id":"333f2e87-a5d6-4be3-8203-e9fec66d44fe","actor_username":"brad2@brad.co","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-02-05 06:38:27.195072+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a62af0f1-984b-4f18-811c-53e04aee1055', '{"action":"login","actor_id":"333f2e87-a5d6-4be3-8203-e9fec66d44fe","actor_username":"brad2@brad.co","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 06:38:27.198361+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca056696-d188-4908-9ac0-d005ada0973d', '{"action":"user_repeated_signup","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-02-05 06:39:29.27624+00', ''),
	('00000000-0000-0000-0000-000000000000', '262b389d-7cf6-47de-a2a8-cddc5000d50b', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 06:39:36.768134+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd952cf7-e815-4b54-b797-165ce6d7656e', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 06:40:32.386986+00', ''),
	('00000000-0000-0000-0000-000000000000', '32764a43-9a60-4a60-8f8d-fcc984fcdfda', '{"action":"user_repeated_signup","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-02-05 06:41:08.791418+00', ''),
	('00000000-0000-0000-0000-000000000000', '86f43a8b-5224-4ddd-979c-1a480bff4501', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 06:41:25.072536+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd28f8245-7ae7-45f1-a6b9-c069b30e226d', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 06:42:11.085057+00', ''),
	('00000000-0000-0000-0000-000000000000', '9ee08862-f88d-4f79-ba4d-d69c6232ce6d', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 07:21:40.16806+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc1c509a-432f-4cba-bc0c-e7df81a56606', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 07:24:12.931643+00', ''),
	('00000000-0000-0000-0000-000000000000', '31c66783-ac83-4109-aae0-dd393f43efc8', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 17:01:13.951117+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7a4a7d8-7bf4-47bc-809b-67e0c809ff5f', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 17:05:37.782797+00', ''),
	('00000000-0000-0000-0000-000000000000', '2718a48e-d1a3-48cb-9f25-cfc9583cd647', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 17:16:36.90806+00', ''),
	('00000000-0000-0000-0000-000000000000', '23c49423-9fc5-464c-8c5c-8b021a8fb5f0', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 17:53:39.498107+00', ''),
	('00000000-0000-0000-0000-000000000000', '2192a593-04f1-49d1-ab5f-d87e30d31c95', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 17:54:22.630151+00', ''),
	('00000000-0000-0000-0000-000000000000', '439381fa-7e0e-440c-b4f0-6490ee1a6a16', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 17:57:07.685755+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e8d2ae8-24a0-43b6-a2a4-a94df1df8135', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 18:00:58.893695+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ecfe1cde-5cfe-4f16-941a-d27d25308ae7', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 18:02:05.808197+00', ''),
	('00000000-0000-0000-0000-000000000000', '76dac00b-7e4a-4881-b836-72126960112b', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 18:03:19.017469+00', ''),
	('00000000-0000-0000-0000-000000000000', '1da69847-649e-4ef6-83c4-5119d83bb53f', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 18:04:15.08749+00', ''),
	('00000000-0000-0000-0000-000000000000', '2bf1bbee-c2e0-49f8-8913-a3745cb539fe', '{"action":"login","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-05 18:05:26.315071+00', ''),
	('00000000-0000-0000-0000-000000000000', '1013af16-4004-4043-9a1c-99869f5e30fd', '{"action":"token_refreshed","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"token"}', '2025-02-06 02:07:39.233083+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fd0e7716-e238-48ee-a0be-1dc0212e22a3', '{"action":"token_revoked","actor_id":"027974b0-e83b-408b-9e24-7deb2a367459","actor_username":"brad@brad.com","actor_via_sso":false,"log_type":"token"}', '2025-02-06 02:07:39.237026+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '4f0408f4-6151-4c6f-ad20-bf3e89a0518c', 'authenticated', 'authenticated', 'brad2@brad.com', '$2a$10$tORWcBWqOQ4Gx3kV2FW7rOzMVsmWVBfkP5DUhDjfuHn97mDaeuQs2', '2025-02-05 06:23:04.201026+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-02-05 06:23:04.20888+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "4f0408f4-6151-4c6f-ad20-bf3e89a0518c", "email": "brad2@brad.com", "email_verified": true, "phone_verified": false}', NULL, '2025-02-05 06:23:04.164013+00', '2025-02-05 06:23:04.217119+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '027974b0-e83b-408b-9e24-7deb2a367459', 'authenticated', 'authenticated', 'brad@brad.com', '$2a$10$MaV.x7gEFUpNSounT/90C.Lr/MHfHtAcxw.sD2tYPsaLFvA3xfVpm', '2024-12-20 00:31:34.800091+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-02-05 18:05:26.31594+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "027974b0-e83b-408b-9e24-7deb2a367459", "email": "brad@brad.com", "email_verified": false, "phone_verified": false}', NULL, '2024-12-20 00:31:34.786553+00', '2025-02-06 02:07:39.244804+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '60382be9-c689-40eb-8fcf-c0be1ec886a5', 'authenticated', 'authenticated', 'test@test.com', '$2a$10$XWqTRUWiHf2hj4db4YSzs.0J0sgEXN2B8F0pZfWb0UszkJNghK9BO', '2024-12-20 18:29:54.005171+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-20 18:29:54.008006+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "60382be9-c689-40eb-8fcf-c0be1ec886a5", "email": "test@test.com", "email_verified": false, "phone_verified": false}', NULL, '2024-12-20 18:29:53.993844+00', '2024-12-20 18:29:54.010276+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '333f2e87-a5d6-4be3-8203-e9fec66d44fe', 'authenticated', 'authenticated', 'brad2@brad.co', '$2a$10$DNGIcoWMhejnN7TQyehqxOwoYcC1032skrGagV2qmj46CZVD.2682', '2025-02-05 06:38:27.195769+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-02-05 06:38:27.199052+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "333f2e87-a5d6-4be3-8203-e9fec66d44fe", "email": "brad2@brad.co", "email_verified": true, "phone_verified": false}', NULL, '2025-02-05 06:38:27.183376+00', '2025-02-05 06:38:27.200525+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('027974b0-e83b-408b-9e24-7deb2a367459', '027974b0-e83b-408b-9e24-7deb2a367459', '{"sub": "027974b0-e83b-408b-9e24-7deb2a367459", "email": "brad@brad.com", "email_verified": false, "phone_verified": false}', 'email', '2024-12-20 00:31:34.796487+00', '2024-12-20 00:31:34.79652+00', '2024-12-20 00:31:34.79652+00', '1a92f77f-d660-49a1-a277-0be98a095bbd'),
	('60382be9-c689-40eb-8fcf-c0be1ec886a5', '60382be9-c689-40eb-8fcf-c0be1ec886a5', '{"sub": "60382be9-c689-40eb-8fcf-c0be1ec886a5", "email": "test@test.com", "email_verified": false, "phone_verified": false}', 'email', '2024-12-20 18:29:54.002336+00', '2024-12-20 18:29:54.002367+00', '2024-12-20 18:29:54.002367+00', 'dbc3fa1c-a944-48cd-87a9-49e5f4d63f17'),
	('4f0408f4-6151-4c6f-ad20-bf3e89a0518c', '4f0408f4-6151-4c6f-ad20-bf3e89a0518c', '{"sub": "4f0408f4-6151-4c6f-ad20-bf3e89a0518c", "email": "brad2@brad.com", "email_verified": false, "phone_verified": false}', 'email', '2025-02-05 06:23:04.190272+00', '2025-02-05 06:23:04.190815+00', '2025-02-05 06:23:04.190815+00', '355683a1-7f5d-444f-86be-48ad0d4861a5'),
	('333f2e87-a5d6-4be3-8203-e9fec66d44fe', '333f2e87-a5d6-4be3-8203-e9fec66d44fe', '{"sub": "333f2e87-a5d6-4be3-8203-e9fec66d44fe", "email": "brad2@brad.co", "email_verified": false, "phone_verified": false}', 'email', '2025-02-05 06:38:27.191657+00', '2025-02-05 06:38:27.191686+00', '2025-02-05 06:38:27.191686+00', '6d266030-1dd3-43e1-b519-579bdb3aa9e2');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('0983eb6d-f1a4-4b64-ab50-b3f1f96881f1', '60382be9-c689-40eb-8fcf-c0be1ec886a5', '2024-12-20 18:29:54.008062+00', '2024-12-20 18:29:54.008062+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '172.18.0.1', NULL),
	('b646a050-2858-4b21-af1d-09bfd77e221c', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 18:00:58.894628+00', '2025-02-05 18:00:58.894628+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('ccb0fca6-16eb-4d8d-8b9b-20d04e317cb3', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 18:02:05.808871+00', '2025-02-05 18:02:05.808871+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('91f22a7a-1a27-49a2-b4c9-c525e8bc221b', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 18:03:19.018404+00', '2025-02-05 18:03:19.018404+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('57a75427-91e0-469c-9237-22cd2922ca04', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 18:04:15.088142+00', '2025-02-05 18:04:15.088142+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('4f70d4de-4c7c-4213-ba9d-4f9df0350864', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-01 18:46:58.536691+00', '2025-02-01 18:46:58.536691+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '192.168.65.1', NULL),
	('1d3d82b9-2fff-46cc-a834-4373e7b297d0', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-01 18:47:09.41565+00', '2025-02-01 18:47:09.41565+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '192.168.65.1', NULL),
	('4edef004-d835-4fe6-b2e3-b5935b64e4d8', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-02 00:20:45.344045+00', '2025-02-02 00:20:45.344045+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '192.168.65.1', NULL),
	('8c410e96-86ef-4276-bbe2-6a42c45a6a9b', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-02 00:22:13.190462+00', '2025-02-02 00:22:13.190462+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '192.168.65.1', NULL),
	('40a0050c-fe82-4b19-a006-abffbcdf0266', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-02 00:31:22.555646+00', '2025-02-02 00:31:22.555646+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '192.168.65.1', NULL),
	('e9578599-0d91-4ab2-85e4-921a0f3f5fe7', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-02 01:50:07.977793+00', '2025-02-02 01:50:07.977793+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '192.168.65.1', NULL),
	('90062262-7fe2-4119-a747-172608cb48ff', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-02 22:15:04.599466+00', '2025-02-02 22:15:04.599466+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '192.168.65.1', NULL),
	('a0465af8-55f4-4921-bd19-ba4f3e0768c9', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-03 18:41:18.479259+00', '2025-02-03 18:41:18.479259+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '192.168.65.1', NULL),
	('0d01f618-d753-4f80-8c30-c320108725e5', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-03 20:51:01.893966+00', '2025-02-03 20:51:01.893966+00', NULL, 'aal1', NULL, NULL, 'curl/8.7.1', '192.168.65.1', NULL),
	('a026b240-7e72-4f2d-a5e5-1ad09620df18', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 06:36:45.876683+00', '2025-02-05 06:36:45.876683+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('f417c869-a9d1-4354-bfa6-4f8b86b957d5', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 06:38:09.796372+00', '2025-02-05 06:38:09.796372+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('607216b1-7acb-479c-80d7-b7338d404188', '333f2e87-a5d6-4be3-8203-e9fec66d44fe', '2025-02-05 06:38:27.199096+00', '2025-02-05 06:38:27.199096+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('1f544544-67c3-4a19-b315-e297972f9f90', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 06:39:36.769121+00', '2025-02-05 06:39:36.769121+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('fd98be9d-55a9-4d50-88d0-0e2620dee838', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 06:40:32.387911+00', '2025-02-05 06:40:32.387911+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('4b24a222-66b2-451c-afe6-a51020aa70ed', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 06:41:25.073432+00', '2025-02-05 06:41:25.073432+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('409ebccb-c1ae-4ec5-b819-315807bb9e1c', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 06:42:11.087868+00', '2025-02-05 06:42:11.087868+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('b1d11951-50bc-4878-b345-5c7c09732462', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 07:21:40.169073+00', '2025-02-05 07:21:40.169073+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('5824879d-24e1-485e-8c6c-6d9c981c1b8d', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 07:24:12.932399+00', '2025-02-05 07:24:12.932399+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('0efd43f6-7275-4b8e-b85f-43a88813c20d', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 17:01:13.955267+00', '2025-02-05 17:01:13.955267+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('42918c6c-5e76-4be2-872a-8151255f6013', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 17:05:37.783575+00', '2025-02-05 17:05:37.783575+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('306a97bd-86f1-45a9-8cb7-3c096b5fefb1', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 17:16:36.909298+00', '2025-02-05 17:16:36.909298+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('122f966a-3d05-4570-b7ef-97484bc7e3d9', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 17:53:39.499443+00', '2025-02-05 17:53:39.499443+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('7bd7cb79-da56-4fd2-bcbb-d917031266db', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 17:54:22.631004+00', '2025-02-05 17:54:22.631004+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('0ec5a6bc-d296-4634-96cb-7ef8e14294d6', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 17:57:07.68667+00', '2025-02-05 17:57:07.68667+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('405e3385-c05d-48d2-9067-78f4538585ce', '027974b0-e83b-408b-9e24-7deb2a367459', '2025-02-05 18:05:26.315984+00', '2025-02-06 02:07:39.248336+00', NULL, 'aal1', NULL, '2025-02-06 02:07:39.248268', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('0983eb6d-f1a4-4b64-ab50-b3f1f96881f1', '2024-12-20 18:29:54.01057+00', '2024-12-20 18:29:54.01057+00', 'password', 'ea21ccb3-6fe4-4e5a-9230-6ede57491a39'),
	('4f70d4de-4c7c-4213-ba9d-4f9df0350864', '2025-02-01 18:46:58.550037+00', '2025-02-01 18:46:58.550037+00', 'password', 'd6d11981-4760-4cb3-8fd6-88c35e3b9183'),
	('1d3d82b9-2fff-46cc-a834-4373e7b297d0', '2025-02-01 18:47:09.417819+00', '2025-02-01 18:47:09.417819+00', 'password', '274f5439-4e0c-45e2-ad3e-8a422fc65832'),
	('4edef004-d835-4fe6-b2e3-b5935b64e4d8', '2025-02-02 00:20:45.349967+00', '2025-02-02 00:20:45.349967+00', 'password', '7e7ccd15-cd4b-4bbc-9fe5-4cdd2e80a24b'),
	('8c410e96-86ef-4276-bbe2-6a42c45a6a9b', '2025-02-02 00:22:13.192835+00', '2025-02-02 00:22:13.192835+00', 'password', '81bb6c32-5be5-4cda-b042-766ca39a3213'),
	('40a0050c-fe82-4b19-a006-abffbcdf0266', '2025-02-02 00:31:22.558957+00', '2025-02-02 00:31:22.558957+00', 'password', '7996ec92-b4fa-4cc1-b9dc-d120fbd41424'),
	('e9578599-0d91-4ab2-85e4-921a0f3f5fe7', '2025-02-02 01:50:07.981269+00', '2025-02-02 01:50:07.981269+00', 'password', '6b36619f-3d59-4194-bd2b-25c33084e3aa'),
	('90062262-7fe2-4119-a747-172608cb48ff', '2025-02-02 22:15:04.612649+00', '2025-02-02 22:15:04.612649+00', 'password', '97285619-912f-425a-9fbd-fae3b2674f3c'),
	('a0465af8-55f4-4921-bd19-ba4f3e0768c9', '2025-02-03 18:41:18.487178+00', '2025-02-03 18:41:18.487178+00', 'password', '86f3cd00-0522-49f0-b46f-05a84016abf8'),
	('0d01f618-d753-4f80-8c30-c320108725e5', '2025-02-03 20:51:01.899495+00', '2025-02-03 20:51:01.899495+00', 'password', '4f05e4ff-1cb0-4ebb-8fc6-b59d38dc7f68'),
	('a026b240-7e72-4f2d-a5e5-1ad09620df18', '2025-02-05 06:36:45.880894+00', '2025-02-05 06:36:45.880894+00', 'password', 'a34d585a-d37c-4be7-b7f1-ef0987ac4728'),
	('f417c869-a9d1-4354-bfa6-4f8b86b957d5', '2025-02-05 06:38:09.802924+00', '2025-02-05 06:38:09.802924+00', 'password', 'abdf4739-175b-4963-9cac-7cb1018e1ff2'),
	('607216b1-7acb-479c-80d7-b7338d404188', '2025-02-05 06:38:27.200773+00', '2025-02-05 06:38:27.200773+00', 'password', 'd51028ed-baf1-4e8f-8e42-8c148859f63a'),
	('1f544544-67c3-4a19-b315-e297972f9f90', '2025-02-05 06:39:36.771537+00', '2025-02-05 06:39:36.771537+00', 'password', 'b89c7e10-3e84-4173-8772-d5194b61c040'),
	('fd98be9d-55a9-4d50-88d0-0e2620dee838', '2025-02-05 06:40:32.390226+00', '2025-02-05 06:40:32.390226+00', 'password', '9ebed49b-3db8-4ba6-a662-bed4fc8e1204'),
	('4b24a222-66b2-451c-afe6-a51020aa70ed', '2025-02-05 06:41:25.076675+00', '2025-02-05 06:41:25.076675+00', 'password', 'c0f6f7ad-3a05-42ae-aee8-2df52454fff3'),
	('409ebccb-c1ae-4ec5-b819-315807bb9e1c', '2025-02-05 06:42:11.090305+00', '2025-02-05 06:42:11.090305+00', 'password', '963bae1f-841f-4fff-9db5-5e07d9cecd9c'),
	('b1d11951-50bc-4878-b345-5c7c09732462', '2025-02-05 07:21:40.170947+00', '2025-02-05 07:21:40.170947+00', 'password', '0620e907-96fa-410b-9733-b1bcbc7f605e'),
	('5824879d-24e1-485e-8c6c-6d9c981c1b8d', '2025-02-05 07:24:12.934081+00', '2025-02-05 07:24:12.934081+00', 'password', '9e94e32b-b2c2-41aa-89f0-d1cba1258afc'),
	('0efd43f6-7275-4b8e-b85f-43a88813c20d', '2025-02-05 17:01:13.96594+00', '2025-02-05 17:01:13.96594+00', 'password', 'b3cd3b7b-4679-48fb-9689-7178a8ad3a5f'),
	('42918c6c-5e76-4be2-872a-8151255f6013', '2025-02-05 17:05:37.785789+00', '2025-02-05 17:05:37.785789+00', 'password', 'c0ffca23-c55c-41e2-ac6e-71f37648a0ad'),
	('306a97bd-86f1-45a9-8cb7-3c096b5fefb1', '2025-02-05 17:16:36.911563+00', '2025-02-05 17:16:36.911563+00', 'password', 'fa73f761-bd94-4ed9-9233-217d84616692'),
	('122f966a-3d05-4570-b7ef-97484bc7e3d9', '2025-02-05 17:53:39.502919+00', '2025-02-05 17:53:39.502919+00', 'password', '8444d54c-c631-4e97-8147-b8b594dd31a4'),
	('7bd7cb79-da56-4fd2-bcbb-d917031266db', '2025-02-05 17:54:22.632706+00', '2025-02-05 17:54:22.632706+00', 'password', 'a1b1326c-9401-47f6-89a3-c67c2e959d2a'),
	('0ec5a6bc-d296-4634-96cb-7ef8e14294d6', '2025-02-05 17:57:07.691151+00', '2025-02-05 17:57:07.691151+00', 'password', 'a38b96d8-aad6-4559-9126-7cf0e4fbefa4'),
	('b646a050-2858-4b21-af1d-09bfd77e221c', '2025-02-05 18:00:58.896959+00', '2025-02-05 18:00:58.896959+00', 'password', 'd89393e6-2c7c-4488-b4ec-702f16c40010'),
	('ccb0fca6-16eb-4d8d-8b9b-20d04e317cb3', '2025-02-05 18:02:05.810923+00', '2025-02-05 18:02:05.810923+00', 'password', '2330737d-c4f3-43b2-b550-20ac19fcde23'),
	('91f22a7a-1a27-49a2-b4c9-c525e8bc221b', '2025-02-05 18:03:19.020681+00', '2025-02-05 18:03:19.020681+00', 'password', '2955ddc9-c499-4fee-bec9-14212d1f236f'),
	('57a75427-91e0-469c-9237-22cd2922ca04', '2025-02-05 18:04:15.090408+00', '2025-02-05 18:04:15.090408+00', 'password', '78ba2b8e-b58a-467d-b244-be584dce6f66'),
	('405e3385-c05d-48d2-9067-78f4538585ce', '2025-02-05 18:05:26.317771+00', '2025-02-05 18:05:26.317771+00', 'password', '91615257-6056-4bae-98ea-f3d90ec85ebc');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 2, 'VkyADLkHBFkyga1j7se0Sw', '60382be9-c689-40eb-8fcf-c0be1ec886a5', false, '2024-12-20 18:29:54.009422+00', '2024-12-20 18:29:54.009422+00', NULL, '0983eb6d-f1a4-4b64-ab50-b3f1f96881f1'),
	('00000000-0000-0000-0000-000000000000', 14, 'nTMYGq4R_XRvFGYq11YXCA', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-01 18:46:58.541593+00', '2025-02-01 18:46:58.541593+00', NULL, '4f70d4de-4c7c-4213-ba9d-4f9df0350864'),
	('00000000-0000-0000-0000-000000000000', 15, 'zit6mayCc1Lw_OTURE8znQ', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-01 18:47:09.41654+00', '2025-02-01 18:47:09.41654+00', NULL, '1d3d82b9-2fff-46cc-a834-4373e7b297d0'),
	('00000000-0000-0000-0000-000000000000', 16, '5xN489uac4Rzi3y5BXZl_g', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-02 00:20:45.346767+00', '2025-02-02 00:20:45.346767+00', NULL, '4edef004-d835-4fe6-b2e3-b5935b64e4d8'),
	('00000000-0000-0000-0000-000000000000', 17, 'HCYEmRH6VOC7GZO5TWeBRQ', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-02 00:22:13.191425+00', '2025-02-02 00:22:13.191425+00', NULL, '8c410e96-86ef-4276-bbe2-6a42c45a6a9b'),
	('00000000-0000-0000-0000-000000000000', 18, 'ndS28MzZD6USm3tXwWaV6Q', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-02 00:31:22.557051+00', '2025-02-02 00:31:22.557051+00', NULL, '40a0050c-fe82-4b19-a006-abffbcdf0266'),
	('00000000-0000-0000-0000-000000000000', 19, '31XCtTTIde_u-hG9iI5q7Q', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-02 01:50:07.978722+00', '2025-02-02 01:50:07.978722+00', NULL, 'e9578599-0d91-4ab2-85e4-921a0f3f5fe7'),
	('00000000-0000-0000-0000-000000000000', 20, 'o7qB3t5FgSPluVYnPl9UQg', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-02 22:15:04.604004+00', '2025-02-02 22:15:04.604004+00', NULL, '90062262-7fe2-4119-a747-172608cb48ff'),
	('00000000-0000-0000-0000-000000000000', 53, '7l8epjrx2biiFoReaHYTLA', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-03 18:41:18.481469+00', '2025-02-03 18:41:18.481469+00', NULL, 'a0465af8-55f4-4921-bd19-ba4f3e0768c9'),
	('00000000-0000-0000-0000-000000000000', 86, 'EDVC0UKQmNvhOUp79lijhg', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-03 20:51:01.896203+00', '2025-02-03 20:51:01.896203+00', NULL, '0d01f618-d753-4f80-8c30-c320108725e5'),
	('00000000-0000-0000-0000-000000000000', 88, '_Um2N6xnrcyVVxMvV07FNA', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 06:36:45.878345+00', '2025-02-05 06:36:45.878345+00', NULL, 'a026b240-7e72-4f2d-a5e5-1ad09620df18'),
	('00000000-0000-0000-0000-000000000000', 89, 'kY_VyHxPEAG6QtxTyEUq7A', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 06:38:09.797334+00', '2025-02-05 06:38:09.797334+00', NULL, 'f417c869-a9d1-4354-bfa6-4f8b86b957d5'),
	('00000000-0000-0000-0000-000000000000', 90, 'cgdaX_7ExAmCt-WwQ0wzCw', '333f2e87-a5d6-4be3-8203-e9fec66d44fe', false, '2025-02-05 06:38:27.199725+00', '2025-02-05 06:38:27.199725+00', NULL, '607216b1-7acb-479c-80d7-b7338d404188'),
	('00000000-0000-0000-0000-000000000000', 91, 'bUIH3WGeGs8tLMH1Kox9eQ', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 06:39:36.770078+00', '2025-02-05 06:39:36.770078+00', NULL, '1f544544-67c3-4a19-b315-e297972f9f90'),
	('00000000-0000-0000-0000-000000000000', 92, 'KB_GPinsOYCY9uYtsrDtMg', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 06:40:32.388869+00', '2025-02-05 06:40:32.388869+00', NULL, 'fd98be9d-55a9-4d50-88d0-0e2620dee838'),
	('00000000-0000-0000-0000-000000000000', 93, 'Pb3e6xfSBOKzMMjS-VZzlA', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 06:41:25.074331+00', '2025-02-05 06:41:25.074331+00', NULL, '4b24a222-66b2-451c-afe6-a51020aa70ed'),
	('00000000-0000-0000-0000-000000000000', 94, 'beluMLhxaVwpzca8gMOQ_w', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 06:42:11.088845+00', '2025-02-05 06:42:11.088845+00', NULL, '409ebccb-c1ae-4ec5-b819-315807bb9e1c'),
	('00000000-0000-0000-0000-000000000000', 95, 'vi3A-uP8KqgRW9k-Ibw4wQ', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 07:21:40.169858+00', '2025-02-05 07:21:40.169858+00', NULL, 'b1d11951-50bc-4878-b345-5c7c09732462'),
	('00000000-0000-0000-0000-000000000000', 96, 'qhwLjGKoE9q4-5Sev1GhVg', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 07:24:12.933042+00', '2025-02-05 07:24:12.933042+00', NULL, '5824879d-24e1-485e-8c6c-6d9c981c1b8d'),
	('00000000-0000-0000-0000-000000000000', 97, 'JXzRqxpCeS1_KmbhQluvBQ', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 17:01:13.958958+00', '2025-02-05 17:01:13.958958+00', NULL, '0efd43f6-7275-4b8e-b85f-43a88813c20d'),
	('00000000-0000-0000-0000-000000000000', 98, 'aK2Qepq28TutRL-dPsHPcQ', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 17:05:37.784507+00', '2025-02-05 17:05:37.784507+00', NULL, '42918c6c-5e76-4be2-872a-8151255f6013'),
	('00000000-0000-0000-0000-000000000000', 99, 'gR1254uGZPTfqI8FpnQqmA', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 17:16:36.910223+00', '2025-02-05 17:16:36.910223+00', NULL, '306a97bd-86f1-45a9-8cb7-3c096b5fefb1'),
	('00000000-0000-0000-0000-000000000000', 100, 'qTBkggegUJcBfrAfsmF2yQ', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 17:53:39.500737+00', '2025-02-05 17:53:39.500737+00', NULL, '122f966a-3d05-4570-b7ef-97484bc7e3d9'),
	('00000000-0000-0000-0000-000000000000', 101, 'Ua-1apFuSh6B96mcXP4s9w', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 17:54:22.631694+00', '2025-02-05 17:54:22.631694+00', NULL, '7bd7cb79-da56-4fd2-bcbb-d917031266db'),
	('00000000-0000-0000-0000-000000000000', 102, '12uRWRQKz374JRoHL3ChFA', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 17:57:07.687562+00', '2025-02-05 17:57:07.687562+00', NULL, '0ec5a6bc-d296-4634-96cb-7ef8e14294d6'),
	('00000000-0000-0000-0000-000000000000', 103, 'avmY1sfqbb-TBed7mfoZ_Q', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 18:00:58.895566+00', '2025-02-05 18:00:58.895566+00', NULL, 'b646a050-2858-4b21-af1d-09bfd77e221c'),
	('00000000-0000-0000-0000-000000000000', 104, '5FDbIpTrc0mK0gBc-fgu-Q', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 18:02:05.809778+00', '2025-02-05 18:02:05.809778+00', NULL, 'ccb0fca6-16eb-4d8d-8b9b-20d04e317cb3'),
	('00000000-0000-0000-0000-000000000000', 105, '4lvU6veLGqjRKgwv9mXghA', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 18:03:19.019391+00', '2025-02-05 18:03:19.019391+00', NULL, '91f22a7a-1a27-49a2-b4c9-c525e8bc221b'),
	('00000000-0000-0000-0000-000000000000', 106, 'vjp18nKq7mDQXQx7Epe09Q', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-05 18:04:15.089262+00', '2025-02-05 18:04:15.089262+00', NULL, '57a75427-91e0-469c-9237-22cd2922ca04'),
	('00000000-0000-0000-0000-000000000000', 107, 'PtKO4fJLqJYbfFfPnbf9cg', '027974b0-e83b-408b-9e24-7deb2a367459', true, '2025-02-05 18:05:26.316802+00', '2025-02-06 02:07:39.238133+00', NULL, '405e3385-c05d-48d2-9067-78f4538585ce'),
	('00000000-0000-0000-0000-000000000000', 138, 'zDv3v9p5tfHY3c9ZA77Tfw', '027974b0-e83b-408b-9e24-7deb2a367459', false, '2025-02-06 02:07:39.242563+00', '2025-02-06 02:07:39.242563+00', 'PtKO4fJLqJYbfFfPnbf9cg', '405e3385-c05d-48d2-9067-78f4538585ce');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

INSERT INTO "pgsodium"."key" ("id", "status", "created", "expires", "key_type", "key_id", "key_context", "name", "associated_data", "raw_key", "raw_key_nonce", "parent_key", "comment", "user_data") VALUES
	('8b1048bc-2238-4ac8-a88e-2d3a8c2ee7a5', 'valid', '2024-12-30 23:11:16.671928+00', NULL, 'aead-det', 1, '\x7067736f6469756d', NULL, '', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "name") VALUES
	(1, 'All'),
	(2, 'Productivity'),
	(3, 'Utilities'),
	(4, 'Development');


--
-- Data for Name: installable_apps; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."installable_apps" ("id", "name", "icon", "preferred_width", "preferred_height", "min_width", "min_height", "created_at", "url", "description", "screenshots") VALUES
	('a6f2a9f4-9629-406b-bdf4-84e19aa6f68b', 'Calculator', 'calculator', 600, 800, 300, 400, '2024-12-13 16:36:16.89993+00', 'https://reai-apps.vercel.app/calculator', 'Basic calculator with standard operations.', '[0:0]={https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&q=80}'),
	('701acfcb-5054-45d9-91a8-d162a6e6e6eb', 'Block Game', 'blocks', 600, 800, 300, 400, '2024-12-27 22:51:35.137783+00', 'https://reai-apps.vercel.app/blockgame', 'A simple falling block game created by AI', NULL),
	('fadae094-8039-4afd-9fcb-cb9b7df0e639', 'Tic-tac-toe', 'tictactoe', 600, 800, 300, 400, '2024-12-27 23:00:23.219933+00', 'https://reai-apps.vercel.app/tictactoe', 'Classic tic tac toe game for 2 players', NULL);


--
-- Data for Name: app_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."app_categories" ("app_id", "category_id") VALUES
	('a6f2a9f4-9629-406b-bdf4-84e19aa6f68b', 1),
	('a6f2a9f4-9629-406b-bdf4-84e19aa6f68b', 3);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_apps; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

INSERT INTO "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") VALUES
	('4ecc4d17-3b8c-4a1a-be55-12c58bf11a29', 'stripe', '', 'V6NMIJtumRkvIP7fskHbmwl6MAMIsqt9enEaWRO4zZQunY/HwwQtkrAYrANS7kHFqnvPO9r910+c
SPqpjXu1YSKySyzFW9MU7HyLwnY8NQurPZRaTGj/iISwwOE6FBri3ce+W0LoVQkEqHVuFRYfwDH2
GQM27VvW+/1R1aGJPSh8DJrp/4wygeaMbg==', '8b1048bc-2238-4ac8-a88e-2d3a8c2ee7a5', '\x3325ed226732dde31fa6ec0cf856f4ce', '2024-12-30 23:11:16.671928+00', '2024-12-30 23:11:16.671928+00');


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 170, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 133, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."categories_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
