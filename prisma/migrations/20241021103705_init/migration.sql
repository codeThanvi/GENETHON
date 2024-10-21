-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "CallType" AS ENUM ('INCOMING', 'OUTGOING');

-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallLog" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "callType" "CallType" NOT NULL,
    "duration" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentiment" "Sentiment" NOT NULL,
    "transcript" TEXT,
    "audioUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "CallLog" ADD CONSTRAINT "CallLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Create a function to emit a NOTIFY event on new call log insertion
-- Step 1: Create or Replace the Trigger Function to Notify Changes
CREATE OR REPLACE FUNCTION notify_call_log_change() 
RETURNS TRIGGER AS $$
DECLARE 
  operation_type TEXT;
  payload JSON;
BEGIN
  -- Identify the operation type
  IF (TG_OP = 'INSERT') THEN
    operation_type := 'insert';
    payload := row_to_json(NEW);
  ELSIF (TG_OP = 'UPDATE') THEN
    operation_type := 'update';
    payload := json_build_object(
      'old', row_to_json(OLD),
      'new', row_to_json(NEW)
    );
  ELSIF (TG_OP = 'DELETE') THEN
    operation_type := 'delete';
    payload := row_to_json(OLD);
  END IF;

  -- Notify the backend with the operation type and data
  PERFORM pg_notify('call_log_channel', json_build_object(
    'operation', operation_type,
    'data', payload
  )::text);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- Create a trigger to call the function after each INSERT on the CallLog table
-- Step 2: Create the Trigger for INSERT, UPDATE, and DELETE
CREATE TRIGGER call_log_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON "CallLog"
FOR EACH ROW EXECUTE FUNCTION notify_call_log_change();