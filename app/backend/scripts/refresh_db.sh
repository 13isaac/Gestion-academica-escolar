#!/bin/bash
mysql -u usuario -p contraseña -e "DROP DATABASE IF EXISTS digimondb; CREATE DATABASE gestion_academica;"
mysql -u usuario -p contraseña digimondb < database/schema.sql
mysql -u usuario -p contraseña digimondb < database/datos_iniciales.sql