CREATE TABLE `advogados` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usuarioId` int NOT NULL,
	`oab` varchar(20) NOT NULL,
	`especialidades` text,
	`telefone` varchar(20),
	`endereco` text,
	`cidade` varchar(100),
	`estado` varchar(2),
	`fotoPerfil` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advogados_id` PRIMARY KEY(`id`),
	CONSTRAINT `advogados_usuarioId_unique` UNIQUE(`usuarioId`),
	CONSTRAINT `advogados_oab_unique` UNIQUE(`oab`)
);
--> statement-breakpoint
CREATE TABLE `documentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`tipo` varchar(100),
	`data` date,
	`link` text,
	`tamanho` varchar(50),
	`processoId` int NOT NULL,
	`advogadoId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prazos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`descricao` varchar(255) NOT NULL,
	`data` date NOT NULL,
	`prioridade` varchar(20) DEFAULT 'média',
	`tipo` varchar(100),
	`processoId` int NOT NULL,
	`advogadoId` int NOT NULL,
	`concluido` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prazos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `processos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` varchar(30) NOT NULL,
	`cliente` varchar(255) NOT NULL,
	`assunto` varchar(255) NOT NULL,
	`status` varchar(50) DEFAULT 'Em andamento',
	`descricao` text,
	`tribunal` varchar(255),
	`juiz` varchar(255),
	`dataCadastro` timestamp NOT NULL DEFAULT (now()),
	`advogadoId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `processos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publicacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`data` date NOT NULL,
	`diario` varchar(255),
	`descricao` text,
	`link` text,
	`processoId` int,
	`advogadoId` int NOT NULL,
	`origem` varchar(50) DEFAULT 'cnj',
	`idExterno` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `publicacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`descricao` varchar(255) NOT NULL,
	`valor` decimal(10,2) NOT NULL,
	`tipo` varchar(20) NOT NULL,
	`data` date NOT NULL,
	`categoria` varchar(100),
	`metodo` varchar(100),
	`processoId` int,
	`advogadoId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transacoes_id` PRIMARY KEY(`id`)
);
