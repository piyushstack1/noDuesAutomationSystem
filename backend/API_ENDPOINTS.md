# No Dues Automation System - API Endpoints

## Student Routes

### 1. Submit No Dues Form
**Endpoint:** `POST /api/student/noduesform`  
**Content-Type:** `multipart/form-data`

**Form Fields:**
- `student_id` (required) - Student ID
- `studentName` (required) - Full name of student
- `scholarNo` (required) - Scholar number
- `department` (required) - Department code
- `branch` - Branch name
- `degree` (required) - Degree (B.Tech, M.Tech, etc.)
- `course` (required) - Course name
- `mobileNo` (required) - Mobile number
- `email` (required) - Email address
- `hostelNo` - Hostel number (if hosteler)
- `roomNo` - Room number (if hosteler)
- `cgpa` (required) - CGPA
- `aadharPassport` (required) - Aadhar or Passport number
- `address` (required) - Complete address
- `bankAccountNo` (required) - Bank account number
- `ifscCode` (required) - IFSC code
- `isHosteler` - Boolean (true/false)
- `reason` (required) - Reason for no dues
- `profilePicture` (file, required) - Profile picture (image file)
- `documents` (files, optional) - Multiple document files

**Response:**
```json
{
  "message": "No dues form submitted successfully",
  "request": { ... },
  "formData": { ... },
  "studentDetails": { ... },
  "uploadedFiles": {
    "profilePicture": "filename.jpg",
    "documents": ["doc1.pdf", "doc2.pdf"]
  }
}
```

### 2. Get Form Details
**Endpoint:** `GET /api/student/noduesform/:studentId`

**Response:** Returns complete form details with tracks and student information

### 3. Get Approval Status
**Endpoint:** `GET /api/student/approvalstatus/:studentId`

**Response:** Returns status of all approval units

### 4. Get Queries
**Endpoint:** `GET /api/student/queries/:studentId`

**Response:** Returns all pending queries for the student

### 5. Resolve Query
**Endpoint:** `POST /api/student/resolveQuery/:studentId/:approvingUnitId`

**Body:**
```json
{
  "queryId": 123,
  "response": "Query response text"
}
```

### 6. Get Progress Tracker
**Endpoint:** `GET /api/student/tracker/:studentId`

**Response:** Returns progress percentage and statistics

### 7. Get Final Status
**Endpoint:** `GET /api/student/finalStatus/:studentId`

**Response:** Returns final approval status

### 8. Get Request History
**Endpoint:** `GET /api/student/history/:studentId`

**Response:** Returns all past requests

### 9. Student Login
**Endpoint:** `POST /api/student/login`

**Body:**
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

### 10. Student Registration
**Endpoint:** `POST /api/student/register`

**Body:**
```json
{
  "student_id": "CS2021001",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "course": "Computer Science",
  "admission_date": "2021-08-01",
  "department_code": "CSE",
  "hostel_no": "H1"
}
```

## File Upload Notes

- Maximum file size: 10MB per file
- Allowed formats: PDF, JPG, JPEG, PNG, DOC, DOCX
- Maximum documents: 10 files
- Files are stored in `/backend/uploads/` directory
- Access uploaded files via: `http://localhost:5000/uploads/filename`

## Server Configuration

- Port: 5000 (default)
- Database: PostgreSQL
- CORS: Enabled for all origins
- Static files served from: `/uploads`
