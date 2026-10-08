# 🎮 LoL Match Tracker & Analytics (Riftly)

[![Java](https://img.shields.io/badge/Java-17%2B-orange?logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Driven-black?logo=apachekafka)](https://kafka.apache.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-47A248?logo=mongodb)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)

An event-driven, full-stack application designed to track, aggregate, and analyze League of Legends player performance and match history via the Riot Games API.

> 🚧 **Status: In Progress / Work in Active Development**  
> Core ingestion pipeline, event streaming, and baseline UI are functional. Advanced match analytics, charts, and caching layers are currently under active implementation.

---

## 🏗 Architecture Overview

The system is designed with scalability and decoupled communication in mind:
* **Asynchronous Ingestion**: Match updates and polling jobs publish ingestion events to **Apache Kafka**.
* **Worker Processing**: Consumer services ingest raw match data from Riot API, transform it, and persist documents to **MongoDB**.
* **REST API**: Spring Boot exposes structured endpoints for player statistics, recent history, and summoner metadata.
* **SPA Frontend**: Responsive dashboard built with React and TypeScript consuming the backend REST layer.

* ## 🚀 Key Features

- **Summoner Lookup**: Search and display player profile data, tier, rank, and recent form.
- **Event-Driven Processing**: Decoupled ingestion with Apache Kafka to prevent request timeouts and handle Riot API rate limiting smoothly.
- **Persistent Analytics**: Match telemetry and computed statistics stored in MongoDB collections.
- **Responsive Web Client**: Fast and modular UI developed with React, TypeScript, and Vite.

---
## 🛠 Tech Stack

- **Backend**: Java 17+, Spring Boot (Spring Web, Spring Data MongoDB, Spring for Apache Kafka)
- **Messaging**: Apache Kafka
- **Database**: MongoDB
- **Frontend**: React, TypeScript, Vite, CSS Modules
- **DevOps**: Docker, Docker Compose

---

## 🐳 Docker Infrastructure

The required services (Apache Kafka, Zookeeper, MongoDB) run locally via Docker Compose.

---

## 🎨 UI/UX Design (Figma Preview)

Before starting the frontend implementation, the application interface and user experience were fully designed in **Figma**. This helped in mapping the user flows, dashboard layouts, and ensuring an authentic *League of Legends* game-themed visual style.

Here is a preview of the designed dashboards, match analytics, and user interface flows:

<img width="1140" height="640" alt="obraz" src="https://github.com/user-attachments/assets/899f9fc0-c71c-43fa-b52a-3779661d3957" />

<img width="1140" height="640" alt="obraz" src="https://github.com/user-attachments/assets/42da639c-769a-481b-b89f-dcbc438e6d54" />




