#!/usr/bin/env python3

import os
import pandas as pd
import requests
import glob
import json
from time import sleep

# Configuration
BASE_URL = "http://localhost:3002/api"
CREATE_URL = f"{BASE_URL}/States/create"
GET_ALL_URL = f"{BASE_URL}/States"
UPDATE_URL = f"{BASE_URL}/States/update"
EXCEL_DIR = "./data"  # Directory containing Excel files
REQUIRED_FIELDS = [
    "MedianHomePrice", "CapitalGainsTax", "IncomeTax", "SalesTax", 
    "PropertyTax", "Abortion", "CostOfLiving", "K12SchoolPerformance", 
    "HigherEdPerformance", "ForestedLand", "GunLaws", "MinimumWage", 
    "Population", "VoilentCrimes", "PoliticalLeaning"
]

# State data
STATE_DATA = {
    "Alabama": {"name": "Alabama", "MedianHomePrice": "221490.00", "CapitalGainsTax": "5.00", "IncomeTax": "5.00", "Abortion": "F", "CostOfLiving": "88.0", "K12SchoolPerformance": "47", "HigherEdPerformance": "45", "ForestCoverage": "70.57", "GunLaws": "F", "MinimumWage": "7.25", "Population": "5030053", "PropertyTax": "0.40", "SalesTax": "9.00", "ViolentCrime": "403.9", "PoliticalLeaning": "Dark Red"},
    "Alaska": {"name": "Alaska", "MedianHomePrice": "349502.00", "CapitalGainsTax": "0.00", "IncomeTax": "0.00", "Abortion": "B", "CostOfLiving": "123.8", "K12SchoolPerformance": "33", "HigherEdPerformance": "5", "ForestCoverage": "35.16", "GunLaws": "F", "MinimumWage": "11.91", "Population": "736081", "PropertyTax": "1.04", "SalesTax": "1.81", "ViolentCrime": "726.3", "PoliticalLeaning": "Dark Red"},
    "Arizona": {"name": "Arizona", "MedianHomePrice": "426680.00", "CapitalGainsTax": "2.50", "IncomeTax": "2.50", "Abortion": "C", "CostOfLiving": "111.5", "K12SchoolPerformance": "40", "HigherEdPerformance": "43", "ForestCoverage": "25.64", "GunLaws": "F", "MinimumWage": "14.70", "Population": "7158923", "PropertyTax": "0.63", "SalesTax": "8.38", "ViolentCrime": "408.8", "PoliticalLeaning": "Purple"},
    "Arkansas": {"name": "Arkansas", "MedianHomePrice": "198838.00", "CapitalGainsTax": "3.90", "IncomeTax": "4.40", "Abortion": "F", "CostOfLiving": "88.7", "K12SchoolPerformance": "42", "HigherEdPerformance": "30", "ForestCoverage": "56.31", "GunLaws": "F", "MinimumWage": "11.00", "Population": "3013756", "PropertyTax": "0.66", "SalesTax": "9.46", "ViolentCrime": "619.9", "PoliticalLeaning": "Dark Red"},
    "California": {"name": "California", "MedianHomePrice": "765197.00", "CapitalGainsTax": "13.30", "IncomeTax": "13.30", "Abortion": "A", "CostOfLiving": "144.8", "K12SchoolPerformance": "41", "HigherEdPerformance": "2", "ForestCoverage": "32.71", "GunLaws": "A", "MinimumWage": "16.50", "Population": "39576757", "PropertyTax": "0.74", "SalesTax": "9.11", "ViolentCrime": "508.2", "PoliticalLeaning": "Dark Blue"},
    "Colorado": {"name": "Colorado", "MedianHomePrice": "539151.00", "CapitalGainsTax": "4.40", "IncomeTax": "4.40", "Abortion": "A", "CostOfLiving": "102.0", "K12SchoolPerformance": "17", "HigherEdPerformance": "28", "ForestCoverage": "34.42", "GunLaws": "A-", "MinimumWage": "14.81", "Population": "5782171", "PropertyTax": "0.51", "SalesTax": "7.83", "ViolentCrime": "474.0", "PoliticalLeaning": "Light Blue"},
    "Connecticut": {"name": "Connecticut", "MedianHomePrice": "384244.00", "CapitalGainsTax": "6.99", "IncomeTax": "6.99", "Abortion": "A", "CostOfLiving": "112.3", "K12SchoolPerformance": "18", "HigherEdPerformance": "24", "ForestCoverage": "55.24", "GunLaws": "A", "MinimumWage": "16.35", "Population": "3608298", "PropertyTax": "1.73", "SalesTax": "6.35", "ViolentCrime": "150.2", "PoliticalLeaning": "Dark Blue"},
    "Delaware": {"name": "Delaware", "MedianHomePrice": "374252.00", "CapitalGainsTax": "6.60", "IncomeTax": "6.60", "Abortion": "A", "CostOfLiving": "100.8", "K12SchoolPerformance": "38", "HigherEdPerformance": "17", "ForestCoverage": "27.26", "GunLaws": "A-", "MinimumWage": "15.00", "Population": "990837", "PropertyTax": "0.59", "SalesTax": "0.00", "ViolentCrime": "380.2", "PoliticalLeaning": "Dark Blue"},
    "District of Columbia": {"name": "District of Columbia", "MedianHomePrice": "610548.00", "CapitalGainsTax": "10.75", "IncomeTax": "10.75", "Abortion": "A", "CostOfLiving": "141.9", "K12SchoolPerformance": "34", "HigherEdPerformance": "42", "ForestCoverage": "33.90", "GunLaws": "A", "MinimumWage": "17.50", "Population": "705749", "PropertyTax": "0.56", "SalesTax": "6.00", "ViolentCrime": "1150.9", "PoliticalLeaning": "Dark Blue"},
    "Florida": {"name": "Florida", "MedianHomePrice": "392306.00", "CapitalGainsTax": "0.00", "IncomeTax": "0.00", "Abortion": "C", "CostOfLiving": "102.8", "K12SchoolPerformance": "37", "HigherEdPerformance": "1", "ForestCoverage": "50.68", "GunLaws": "C-", "MinimumWage": "13.00", "Population": "21570527", "PropertyTax": "0.86", "SalesTax": "7.04", "ViolentCrime": "290.2", "PoliticalLeaning": "Light Red"},
    "Georgia": {"name": "Georgia", "MedianHomePrice": "321821.00", "CapitalGainsTax": "5.39", "IncomeTax": "5.49", "Abortion": "C", "CostOfLiving": "91.3", "K12SchoolPerformance": "36", "HigherEdPerformance": "3", "ForestCoverage": "67.28", "GunLaws": "F", "MinimumWage": "5.15", "Population": "10725274", "PropertyTax": "0.91", "SalesTax": "7.41", "ViolentCrime": "351.8", "PoliticalLeaning": "Purple"},
    "Hawaii": {"name": "Hawaii", "MedianHomePrice": "839013.00", "CapitalGainsTax": "7.25", "IncomeTax": "11.00", "Abortion": "A", "CostOfLiving": "186.9", "K12SchoolPerformance": "24", "HigherEdPerformance": "20", "ForestCoverage": "42.53", "GunLaws": "A-", "MinimumWage": "14.00", "Population": "1460137", "PropertyTax": "0.31", "SalesTax": "4.44", "ViolentCrime": "187.1", "PoliticalLeaning": "Dark Blue"},
    "Idaho": {"name": "Idaho", "MedianHomePrice": "443500.00", "CapitalGainsTax": "5.69", "IncomeTax": "5.80", "Abortion": "F", "CostOfLiving": "102.0", "K12SchoolPerformance": "21", "HigherEdPerformance": "39", "ForestCoverage": "40.55", "GunLaws": "F", "MinimumWage": "7.25", "Population": "1841377", "PropertyTax": "0.66", "SalesTax": "6.02", "ViolentCrime": "234.0", "PoliticalLeaning": "Dark Red"},
    "Illinois": {"name": "Illinois", "MedianHomePrice": "251267.00", "CapitalGainsTax": "4.95", "IncomeTax": "4.95", "Abortion": "A", "CostOfLiving": "94.4", "K12SchoolPerformance": "22", "HigherEdPerformance": "6", "ForestCoverage": "13.64", "GunLaws": "A-", "MinimumWage": "15.00", "Population": "12822739", "PropertyTax": "2.16", "SalesTax": "8.86", "ViolentCrime": "310.1", "PoliticalLeaning": "Dark Blue"},
    "Indiana": {"name": "Indiana", "MedianHomePrice": "231533.00", "CapitalGainsTax": "3.00", "IncomeTax": "3.15", "Abortion": "F", "CostOfLiving": "90.5", "K12SchoolPerformance": "23", "HigherEdPerformance": "25", "ForestCoverage": "21.06", "GunLaws": "D-", "MinimumWage": "7.25", "Population": "6790280", "PropertyTax": "0.81", "SalesTax": "7.00", "ViolentCrime": "332.2", "PoliticalLeaning": "Light Red"},
    "Iowa": {"name": "Iowa", "MedianHomePrice": "208755.00", "CapitalGainsTax": "3.80", "IncomeTax": "5.70", "Abortion": "C", "CostOfLiving": "89.7", "K12SchoolPerformance": "12", "HigherEdPerformance": "26", "ForestCoverage": "8.43", "GunLaws": "F", "MinimumWage": "7.25", "Population": "3192406", "PropertyTax": "1.38", "SalesTax": "6.94", "ViolentCrime": "279.9", "PoliticalLeaning": "Light Red"},
    "Kansas": {"name": "Kansas", "MedianHomePrice": "217315.00", "CapitalGainsTax": "5.58", "IncomeTax": "5.70", "Abortion": "B", "CostOfLiving": "87.0", "K12SchoolPerformance": "20", "HigherEdPerformance": "34", "ForestCoverage": "4.78", "GunLaws": "F", "MinimumWage": "7.25", "Population": "2940865", "PropertyTax": "1.28", "SalesTax": "8.72", "ViolentCrime": "429.7", "PoliticalLeaning": "Dark Red"},
    "Kentucky": {"name": "Kentucky", "MedianHomePrice": "196550.00", "CapitalGainsTax": "4.00", "IncomeTax": "4.50", "Abortion": "F", "CostOfLiving": "93.0", "K12SchoolPerformance": "39", "HigherEdPerformance": "15", "ForestCoverage": "49.35", "GunLaws": "F", "MinimumWage": "7.25", "Population": "4509342", "PropertyTax": "0.78", "SalesTax": "6.00", "ViolentCrime": "224.3", "PoliticalLeaning": "Dark Red"},
    "Louisiana": {"name": "Louisiana", "MedianHomePrice": "194308.00", "CapitalGainsTax": "3.00", "IncomeTax": "4.25", "Abortion": "F", "CostOfLiving": "92.2", "K12SchoolPerformance": "45", "HigherEdPerformance": "22", "ForestCoverage": "53.20", "GunLaws": "F", "MinimumWage": "No state law", "Population": "4661468", "PropertyTax": "0.52", "SalesTax": "9.56", "ViolentCrime": "548.0", "PoliticalLeaning": "Dark Red"},
    "Maine": {"name": "Maine", "MedianHomePrice": "382580.00", "CapitalGainsTax": "7.15", "IncomeTax": "7.15", "Abortion": "A", "CostOfLiving": "112.1", "K12SchoolPerformance": "14", "HigherEdPerformance": "46", "ForestCoverage": "89.46", "GunLaws": "C+", "MinimumWage": "14.65", "Population": "1363582", "PropertyTax": "1.12", "SalesTax": "5.50", "ViolentCrime": "102.5", "PoliticalLeaning": "Light Blue"},
    "Maryland": {"name": "Maryland", "MedianHomePrice": "406843.00", "CapitalGainsTax": "5.75", "IncomeTax": "5.75", "Abortion": "A", "CostOfLiving": "115.3", "K12SchoolPerformance": "28", "HigherEdPerformance": "18", "ForestCoverage": "39.36", "GunLaws": "A-", "MinimumWage": "15.00", "Population": "6185278", "PropertyTax": "1.03", "SalesTax": "6.00", "ViolentCrime": "426.2", "PoliticalLeaning": "Dark Blue"},
    "Massachusetts": {"name": "Massachusetts", "MedianHomePrice": "596410.00", "CapitalGainsTax": "9.00", "IncomeTax": "5.00", "Abortion": "A", "CostOfLiving": "145.9", "K12SchoolPerformance": "1", "HigherEdPerformance": "38", "ForestCoverage": "60.57", "GunLaws": "A", "MinimumWage": "15.00", "Population": "7033469", "PropertyTax": "1.52", "SalesTax": "6.25", "ViolentCrime": "314.2", "PoliticalLeaning": "Dark Blue"},
    "Michigan": {"name": "Michigan", "MedianHomePrice": "232511.00", "CapitalGainsTax": "4.25", "IncomeTax": "4.25", "Abortion": "A", "CostOfLiving": "90.4", "K12SchoolPerformance": "26", "HigherEdPerformance": "41", "ForestCoverage": "55.62", "GunLaws": "B-", "MinimumWage": "10.56", "Population": "10084442", "PropertyTax": "1.44", "SalesTax": "6.00", "ViolentCrime": "457.2", "PoliticalLeaning": "Purple"},
    "Minnesota": {"name": "Minnesota", "MedianHomePrice": "323034.00", "CapitalGainsTax": "9.85", "IncomeTax": "9.85", "Abortion": "A", "CostOfLiving": "95.1", "K12SchoolPerformance": "8", "HigherEdPerformance": "27", "ForestCoverage": "34.08", "GunLaws": "B", "MinimumWage": "11.13", "Population": "5709752", "PropertyTax": "1.08", "SalesTax": "7.56", "ViolentCrime": "261.1", "PoliticalLeaning": "Light Blue"},
    "Mississippi": {"name": "Mississippi", "MedianHomePrice": "171613.00", "CapitalGainsTax": "4.40", "IncomeTax": "4.70", "Abortion": "F", "CostOfLiving": "87.9", "K12SchoolPerformance": "46", "HigherEdPerformance": "32", "ForestCoverage": "65.07", "GunLaws": "F", "MinimumWage": "No state law", "Population": "2963914", "PropertyTax": "0.69", "SalesTax": "7.07", "ViolentCrime": "202.8", "PoliticalLeaning": "Dark Red"},
    "Missouri": {"name": "Missouri", "MedianHomePrice": "238125.00", "CapitalGainsTax": "4.70", "IncomeTax": "4.95", "Abortion": "F", "CostOfLiving": "88.7", "K12SchoolPerformance": "27", "HigherEdPerformance": "29", "ForestCoverage": "35.16", "GunLaws": "F", "MinimumWage": "13.75", "Population": "6160281", "PropertyTax": "0.88", "SalesTax": "8.42", "ViolentCrime": "458.7", "PoliticalLeaning": "Dark Red"},
    "Montana": {"name": "Montana", "MedianHomePrice": "448238.00", "CapitalGainsTax": "5.90", "IncomeTax": "5.90", "Abortion": "B", "CostOfLiving": "94.9", "K12SchoolPerformance": "13", "HigherEdPerformance": "49", "ForestCoverage": "27.45", "GunLaws": "F", "MinimumWage": "10.55", "Population": "1085407", "PropertyTax": "0.75", "SalesTax": "0.00", "ViolentCrime": "442.0", "PoliticalLeaning": "Dark Red"},
    "Nebraska": {"name": "Nebraska", "MedianHomePrice": "251315.00", "CapitalGainsTax": "5.20", "IncomeTax": "5.84", "Abortion": "C", "CostOfLiving": "93.1", "K12SchoolPerformance": "15", "HigherEdPerformance": "23", "ForestCoverage": "3.20", "GunLaws": "C-", "MinimumWage": "13.50", "Population": "1963333", "PropertyTax": "1.73", "SalesTax": "6.99", "ViolentCrime": "229.7", "PoliticalLeaning": "Dark Red"},
    "Nevada": {"name": "Nevada", "MedianHomePrice": "426267.00", "CapitalGainsTax": "0.00", "IncomeTax": "0.00", "Abortion": "A", "CostOfLiving": "101.3", "K12SchoolPerformance": "44", "HigherEdPerformance": "16", "ForestCoverage": "15.89", "GunLaws": "B-", "MinimumWage": "12.00", "Population": "3108462", "PropertyTax": "0.60", "SalesTax": "8.24", "ViolentCrime": "416.8", "PoliticalLeaning": "Purple"},
    "New Hampshire": {"name": "New Hampshire", "MedianHomePrice": "454948.00", "CapitalGainsTax": "0.00", "IncomeTax": "4.00", "Abortion": "B", "CostOfLiving": "112.6", "K12SchoolPerformance": "2", "HigherEdPerformance": "51", "ForestCoverage": "84.32", "GunLaws": "D-", "MinimumWage": "7.25", "Population": "1379089", "PropertyTax": "2.10", "SalesTax": "0.00", "ViolentCrime": "107.2", "PoliticalLeaning": "Light Blue"},
    "New Jersey": {"name": "New Jersey", "MedianHomePrice": "503432.00", "CapitalGainsTax": "10.75", "IncomeTax": "10.75", "Abortion": "A", "CostOfLiving": "114.6", "K12SchoolPerformance": "11", "HigherEdPerformance": "13", "ForestCoverage": "41.72", "GunLaws": "A", "MinimumWage": "15.49", "Population": "9294493", "PropertyTax": "2.42", "SalesTax": "6.60", "ViolentCrime": "221.3", "PoliticalLeaning": "Dark Blue"},
    "New Mexico": {"name": "New Mexico", "MedianHomePrice": "292280.00", "CapitalGainsTax": "5.90", "IncomeTax": "5.90", "Abortion": "A", "CostOfLiving": "93.3", "K12SchoolPerformance": "51", "HigherEdPerformance": "8", "ForestCoverage": "31.99", "GunLaws": "B-", "MinimumWage": "12.00", "Population": "2120220", "PropertyTax": "0.68", "SalesTax": "7.60", "ViolentCrime": "749.3", "PoliticalLeaning": "Light Blue"},
    "New York": {"name": "New York", "MedianHomePrice": "453138.00", "CapitalGainsTax": "10.90", "IncomeTax": "10.90", "Abortion": "A", "CostOfLiving": "123.3", "K12SchoolPerformance": "31", "HigherEdPerformance": "12", "ForestCoverage": "62.88", "GunLaws": "A", "MinimumWage": "16.50", "Population": "20215751", "PropertyTax": "1.58", "SalesTax": "8.53", "ViolentCrime": "389.8", "PoliticalLeaning": "Dark Blue"},
    "North Carolina": {"name": "North Carolina", "MedianHomePrice": "322527.00", "CapitalGainsTax": "4.25", "IncomeTax": "4.50", "Abortion": "C", "CostOfLiving": "97.8", "K12SchoolPerformance": "35", "HigherEdPerformance": "7", "ForestCoverage": "59.73", "GunLaws": "C-", "MinimumWage": "7.25", "Population": "10453948", "PropertyTax": "0.78", "SalesTax": "6.99", "ViolentCrime": "391.4", "PoliticalLeaning": "Purple"},
    "North Dakota": {"name": "North Dakota", "MedianHomePrice": "248022.00", "CapitalGainsTax": "2.50", "IncomeTax": "2.50", "Abortion": "F", "CostOfLiving": "91.9", "K12SchoolPerformance": "7", "HigherEdPerformance": "35", "ForestCoverage": "1.72", "GunLaws": "F", "MinimumWage": "7.25", "Population": "779702", "PropertyTax": "0.94", "SalesTax": "6.97", "ViolentCrime": "267.4", "PoliticalLeaning": "Dark Red"},
    "Ohio": {"name": "Ohio", "MedianHomePrice": "217698.00", "CapitalGainsTax": "3.50", "IncomeTax": "3.50", "Abortion": "C", "CostOfLiving": "94.2", "K12SchoolPerformance": "25", "HigherEdPerformance": "48", "ForestCoverage": "30.92", "GunLaws": "D-", "MinimumWage": "10.70", "Population": "11808848", "PropertyTax": "1.52", "SalesTax": "7.25", "ViolentCrime": "286.5", "PoliticalLeaning": "Light Red"},
    "Oklahoma": {"name": "Oklahoma", "MedianHomePrice": "199378.00", "CapitalGainsTax": "4.75", "IncomeTax": "4.75", "Abortion": "F", "CostOfLiving": "85.7", "K12SchoolPerformance": "49", "HigherEdPerformance": "36", "ForestCoverage": "28.80", "GunLaws": "F", "MinimumWage": "7.25", "Population": "3963516", "PropertyTax": "0.91", "SalesTax": "8.99", "ViolentCrime": "413.7", "PoliticalLeaning": "Dark Red"},
    "Oregon": {"name": "Oregon", "MedianHomePrice": "487244.00", "CapitalGainsTax": "9.90", "IncomeTax": "9.90", "Abortion": "A", "CostOfLiving": "112.0", "K12SchoolPerformance": "29", "HigherEdPerformance": "37", "ForestCoverage": "48.51", "GunLaws": "A-", "MinimumWage": "15.95", "Population": "4241500", "PropertyTax": "0.90", "SalesTax": "0.00", "ViolentCrime": "326.3", "PoliticalLeaning": "Dark Blue"},
    "Pennsylvania": {"name": "Pennsylvania", "MedianHomePrice": "255570.00", "CapitalGainsTax": "3.07", "IncomeTax": "3.07", "Abortion": "B", "CostOfLiving": "95.1", "K12SchoolPerformance": "3", "HigherEdPerformance": "44", "ForestCoverage": "58.60", "GunLaws": "B", "MinimumWage": "7.25", "Population": "13011844", "PropertyTax": "1.50", "SalesTax": "6.34", "ViolentCrime": "266.4", "PoliticalLeaning": "Purple"},
    "Rhode Island": {"name": "Rhode Island", "MedianHomePrice": "438711.00", "CapitalGainsTax": "5.99", "IncomeTax": "5.99", "Abortion": "A", "CostOfLiving": "112.2", "K12SchoolPerformance": "32", "HigherEdPerformance": "47", "ForestCoverage": "54.38", "GunLaws": "A-", "MinimumWage": "15.00", "Population": "1098163", "PropertyTax": "1.53", "SalesTax": "7.00", "ViolentCrime": "167.8", "PoliticalLeaning": "Dark Blue"},
    "South Carolina": {"name": "South Carolina", "MedianHomePrice": "287882.00", "CapitalGainsTax": "6.20", "IncomeTax": "6.40", "Abortion": "C", "CostOfLiving": "95.9", "K12SchoolPerformance": "43", "HigherEdPerformance": "10", "ForestCoverage": "68.19", "GunLaws": "F", "MinimumWage": "No state law", "Population": "5124712", "PropertyTax": "0.54", "SalesTax": "7.50", "ViolentCrime": "471.0", "PoliticalLeaning": "Dark Red"},
    "South Dakota": {"name": "South Dakota", "MedianHomePrice": "292551.00", "CapitalGainsTax": "0.00", "IncomeTax": "0.00", "Abortion": "F", "CostOfLiving": "92.2", "K12SchoolPerformance": "9", "HigherEdPerformance": "33", "ForestCoverage": "3.93", "GunLaws": "F", "MinimumWage": "11.50", "Population": "887770", "PropertyTax": "1.14", "SalesTax": "6.04", "ViolentCrime": "349.7", "PoliticalLeaning": "Dark Red"},
    "Tennessee": {"name": "Tennessee", "MedianHomePrice": "311531.00", "CapitalGainsTax": "0.00", "IncomeTax": "0.00", "Abortion": "F", "CostOfLiving": "90.5", "K12SchoolPerformance": "30", "HigherEdPerformance": "9", "ForestCoverage": "52.83", "GunLaws": "F", "MinimumWage": "No state law", "Population": "6916897", "PropertyTax": "0.68", "SalesTax": "9.55", "ViolentCrime": "628.2", "PoliticalLeaning": "Dark Red"},
    "Texas": {"name": "Texas", "MedianHomePrice": "298624.00", "CapitalGainsTax": "0.00", "IncomeTax": "0.00", "Abortion": "F", "CostOfLiving": "92.7", "K12SchoolPerformance": "48", "HigherEdPerformance": "21", "ForestCoverage": "37.33", "GunLaws": "F", "MinimumWage": "7.25", "Population": "29183290", "PropertyTax": "1.60", "SalesTax": "8.20", "ViolentCrime": "406.0", "PoliticalLeaning": "Light Red"},
    "Utah": {"name": "Utah", "MedianHomePrice": "509433.00", "CapitalGainsTax": "4.55", "IncomeTax": "4.65", "Abortion": "C", "CostOfLiving": "104.9", "K12SchoolPerformance": "4", "HigherEdPerformance": "40", "ForestCoverage": "34.48", "GunLaws": "F", "MinimumWage": "7.25", "Population": "3275252", "PropertyTax": "0.62", "SalesTax": "7.28", "ViolentCrime": "232.2", "PoliticalLeaning": "Dark Red"},
    "Vermont": {"name": "Vermont", "MedianHomePrice": "373001.00", "CapitalGainsTax": "8.75", "IncomeTax": "8.75", "Abortion": "A", "CostOfLiving": "114.4", "K12SchoolPerformance": "5", "HigherEdPerformance": "50", "ForestCoverage": "77.81", "GunLaws": "B-", "MinimumWage": "14.01", "Population": "643503", "PropertyTax": "1.76", "SalesTax": "6.36", "ViolentCrime": "210.4", "PoliticalLeaning": "Dark Blue"},
    "Virginia": {"name": "Virginia", "MedianHomePrice": "377699.00", "CapitalGainsTax": "5.75", "IncomeTax": "5.75", "Abortion": "B", "CostOfLiving": "100.7", "K12SchoolPerformance": "19", "HigherEdPerformance": "11", "ForestCoverage": "62.93", "GunLaws": "B+", "MinimumWage": "12.41", "Population": "8654542", "PropertyTax": "0.93", "SalesTax": "5.78", "ViolentCrime": "236.2", "PoliticalLeaning": "Light Blue"},
    "Washington": {"name": "Washington", "MedianHomePrice": "575894.00", "CapitalGainsTax": "0.00", "IncomeTax": "0.00", "Abortion": "A", "CostOfLiving": "114.2", "K12SchoolPerformance": "16", "HigherEdPerformance": "4", "ForestCoverage": "52.74", "GunLaws": "A-", "MinimumWage": "16.66", "Population": "7715946", "PropertyTax": "0.92", "SalesTax": "9.31", "ViolentCrime": "357.2", "PoliticalLeaning": "Dark Blue"},
    "West Virginia": {"name": "West Virginia", "MedianHomePrice": "155491.00", "CapitalGainsTax": "4.82", "IncomeTax": "5.12", "Abortion": "F", "CostOfLiving": "84.1", "K12SchoolPerformance": "50", "HigherEdPerformance": "31", "ForestCoverage": "79.01", "GunLaws": "F", "MinimumWage": "8.75", "Population": "1795045", "PropertyTax": "0.59", "SalesTax": "6.57", "ViolentCrime": "265.5", "PoliticalLeaning": "Dark Red"},
    "Wisconsin": {"name": "Wisconsin", "MedianHomePrice": "286394.00", "CapitalGainsTax": "7.65", "IncomeTax": "7.65", "Abortion": "F", "CostOfLiving": "97.0", "K12SchoolPerformance": "10", "HigherEdPerformance": "19", "ForestCoverage": "48.98", "GunLaws": "C", "MinimumWage": "7.25", "Population": "5897473", "PropertyTax": "1.85", "SalesTax": "5.48", "ViolentCrime": "288.6", "PoliticalLeaning": "Purple"},
    "Wyoming": {"name": "Wyoming", "MedianHomePrice": "334782.00", "CapitalGainsTax": "0.00", "IncomeTax": "0.00", "Abortion": "F", "CostOfLiving": "95.5", "K12SchoolPerformance": "6", "HigherEdPerformance": "14", "ForestCoverage": "18.42", "GunLaws": "F", "MinimumWage": "5.15", "Population": "577719", "PropertyTax": "0.61", "SalesTax": "5.43", "ViolentCrime": "191.1", "PoliticalLeaning": "Dark Red"}
}

def validate_data(data):
    """Validate that all required fields are present in the data."""
    missing_fields = [field for field in REQUIRED_FIELDS if field not in data]
    if missing_fields:
        print(f"Warning: Missing required fields: {', '.join(missing_fields)}")
        return False
    return True

def process_excel_file(file_path):
    """Process a single Excel file and submit data to the API."""
    print(f"Processing file: {file_path}")
    try:
        # Read Excel file
        df = pd.read_excel(file_path)
        
        # For each row in the dataframe
        success_count = 0
        error_count = 0
        
        for _, row in df.iterrows():
            # Convert row to dictionary and clean NaN values
            data = row.to_dict()
            data = {k: str(v) if pd.notna(v) else "" for k, v in data.items()}
            
            # Validate data
            if not validate_data(data):
                error_count += 1
                continue
            
            # Send data to API
            try:
                response = requests.post(CREATE_URL, json=data)
                if response.status_code == 200:
                    success_count += 1
                else:
                    print(f"API Error: {response.status_code} - {response.text}")
                    error_count += 1
                
                # Small delay to avoid overwhelming the server
                sleep(0.1)
                
            except requests.RequestException as e:
                print(f"Request error: {str(e)}")
                error_count += 1
        
        print(f"Processed {success_count + error_count} records:")
        print(f"  - {success_count} successful")
        print(f"  - {error_count} failed")
        
    except Exception as e:
        print(f"Error processing file {file_path}: {str(e)}")

def send_state_data_to_api():
    """Send state data to the MongoDB API, skipping states that already exist"""
    print("Sending state data to API...")
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    # Field mapping from your data to MongoDB model fields
    field_mapping = {
        "name": "Name",  # Case difference
        "PropertyTax": "PropertyTaxes",
        "HigherEdPerformance": "HigherEdSchoolPerformance",
        "ForestCoverage": "ForestedLand",
        "ViolentCrime": "ViolentCrimes",
        # Add other mappings as needed
    }
    
    # First, try to get all existing states from the database
    existing_states = set()
    try:
        response = requests.get(GET_ALL_URL)
        if response.status_code == 200:
            states_list = response.json()
            for state in states_list:
                existing_states.add(state["Name"])
            print(f"Found {len(existing_states)} existing states in database")
        else:
            print(f"Failed to get existing states: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error getting existing states: {str(e)}")
    
    # Process each state
    for state_key, state_data in STATE_DATA.items():
        try:
            # Create a new dictionary with the correct field names
            mapped_data = {}
            for key, value in state_data.items():
                if key in field_mapping:
                    mapped_data[field_mapping[key]] = value
                else:
                    mapped_data[key] = value
            
            # Check if this state already exists
            state_name = mapped_data.get("Name")
            if state_name in existing_states:
                # State exists, skip it
                print(f"State {state_name} already exists, skipping...")
                skip_count += 1
                continue
            
            # State doesn't exist, create new
            print(f"Creating new state {state_name}...")
            response = requests.post(CREATE_URL, json=mapped_data)
            
            # Check response
            if response.status_code in [200, 201, 204]:
                print(f"Successfully added {state_name}")
                success_count += 1
            else:
                print(f"API Error for {state_name}: {response.status_code} - {response.text}")
                error_count += 1
            
            # Small delay to avoid overwhelming the server
            sleep(0.1)
            
        except Exception as e:
            print(f"Error processing {state_key}: {str(e)}")
            error_count += 1
    
    print(f"Processed {success_count + skip_count + error_count} states:")
    print(f"  - {success_count} successfully added")
    print(f"  - {skip_count} skipped (already exist)")
    print(f"  - {error_count} failed")

def main():
    # Send all state data to API
    send_state_data_to_api()
    print("Processing complete.")

if __name__ == "__main__":
    main()
