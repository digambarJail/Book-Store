# API Routes

This document provides an overview of the API routes available in the Book Store application. All routes use MongoDB Atlas for data storage and are deployed on Render.

## Get All Users

- **Route**:  
  `GET /api/getUsers`  
  [https://book-store-84io.onrender.com/api/getUsers](https://book-store-84io.onrender.com/api/getUsers)

- **Example**:  
  [https://book-store-84io.onrender.com/api/getUsers](https://book-store-84io.onrender.com/api/getUsers)

---

## Get All Books

- **Route**:  
  `GET /api/getBooks`  
  [https://book-store-84io.onrender.com/api/getBooks](https://book-store-84io.onrender.com/api/getBooks)

- **Example**:  
  [https://book-store-84io.onrender.com/api/getBooks](https://book-store-84io.onrender.com/api/getBooks)

---

## Get Books by Book Name or Term in Book Name

- **Route**:  
  `GET /api/getBooks?search=(bookname)`  
  [https://book-store-84io.onrender.com/api/getBooks?search=(bookname)](https://book-store-84io.onrender.com/api/getBooks?search=gar)

- **Example**:  
  [https://book-store-84io.onrender.com/api/getBooks?search=gar](https://book-store-84io.onrender.com/api/getBooks?search=gar)

---

## Get Books by Rent Price Range

- **Route**:  
  `GET /api/getBooks?range=(from-to)`  
  [https://book-store-84io.onrender.com/api/getBooks?range=(from-to)](https://book-store-84io.onrender.com/api/getBooks?range=5-10)

- **Example**:  
  [https://book-store-84io.onrender.com/api/getBooks?range=5-10](https://book-store-84io.onrender.com/api/getBooks?range=5-10)

---

## Get Books by Category + Name/Term + Rent Range

- **Route**:  
  `GET /api/getBooks?category=(category)&search=(search)&range=(range)`  
  [https://book-store-84io.onrender.com/api/getBooks?category=(category)&search=(search)&range=(range)](https://book-store-84io.onrender.com/api/getBooks?category=fiction&search=the&range=2-4)

- **Example**:  
  [https://book-store-84io.onrender.com/api/getBooks?category=fiction&search=the&range=2-4](https://book-store-84io.onrender.com/api/getBooks?category=fiction&search=the&range=2-4)

---

## Issue a Book

- **Route**:  
  `POST /api/issueBook?doi=(yyyy-mm-dd)&uid=(1,2,3,4,5)&bookName=(bookName)`  
  [https://book-store-84io.onrender.com/api/issueBook?doi=(yyyy-mm-dd)&uid=(uid)&bookName=(bookName)](https://book-store-84io.onrender.com/api/issueBook?doi=2024-09-10&uid=3&bookName=Investing%20101)

- **Example**:  
  [https://book-store-84io.onrender.com/api/issueBook?doi=2024-09-10&uid=3&bookName=Investing%20101](https://book-store-84io.onrender.com/api/issueBook?doi=2024-09-10&uid=3&bookName=Investing%20101)

---

## Return a Book

- **Route**:  
  `POST /api/returnBook?dor=(yyyy-mm-dd)&uid=(1,2,3,4,5)&bookName=(bookName)`  
  [https://book-store-84io.onrender.com/api/returnBook?dor=(yyyy-mm-dd)&uid=(uid)&bookName=(bookName)](https://book-store-84io.onrender.com/api/returnBook?dor=2024-09-11&uid=3&bookName=Investing%20101)

- **Example**:  
  [https://book-store-84io.onrender.com/api/returnBook?dor=2024-09-11&uid=3&bookName=Investing%20101](https://book-store-84io.onrender.com/api/returnBook?dor=2024-09-11&uid=3&bookName=Investing%20101)

---

## Get Issuers of a Book (Past and Current) + Total Rent

- **Route**:  
  `GET /api/getIssuers?bookName=(bookName)`  
  [https://book-store-84io.onrender.com/api/getIssuers?bookName=(bookName)](https://book-store-84io.onrender.com/api/getIssuers?bookName=Investing%20101)

- **Example**:  
  [https://book-store-84io.onrender.com/api/getIssuers?bookName=Investing%20101](https://book-store-84io.onrender.com/api/getIssuers?bookName=Investing%20101)

---

## Get Books Issued by a User

- **Route**:  
  `GET /api/getBooksByUser?uid=(1,2,3,4,5)`  
  [https://book-store-84io.onrender.com/api/getBooksByUser?uid=(uid)](https://book-store-84io.onrender.com/api/getBooksByUser?uid=3)

- **Example**:  
  [https://book-store-84io.onrender.com/api/getBooksByUser?uid=3](https://book-store-84io.onrender.com/api/getBooksByUser?uid=3)

---

## Get Books by Date Range

- **Route**:  
  `GET /api/getBooksByDate?from=(yyyy-mm-dd)&to=(yyyy-mm-dd)`  
  [https://book-store-84io.onrender.com/api/getBooksByDate?from=(from)&to=(to)](https://book-store-84io.onrender.com/api/getBooksByDate?from=2024-09-01&to=2024-09-10)

- **Example**:  
  [https://book-store-84io.onrender.com/api/getBooksByDate?from=2024-09-01&to=2024-09-10](https://book-store-84io.onrender.com/api/getBooksByDate?from=2024-09-01&to=2024-09-10)
