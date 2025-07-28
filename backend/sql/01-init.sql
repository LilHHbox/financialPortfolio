-- projectdb.stock_price definition

CREATE TABLE `stock_price` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL COMMENT '股票代码',
  `ts` datetime NOT NULL COMMENT '时间戳',
  `open` decimal(10,2) NOT NULL,
  `high` decimal(10,2) NOT NULL,
  `low` decimal(10,2) NOT NULL,
  `close` decimal(10,2) NOT NULL,
  `volume` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code_time` (`code`,`ts`)
) ENGINE=InnoDB AUTO_INCREMENT=2001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- projectdb.portfolio definition

CREATE TABLE `portfolio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `details` json DEFAULT NULL, COMMENT '包括stockcode 和 ratio'
  `expected_return` float DEFAULT NULL,
  `expected_volatility` float DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
