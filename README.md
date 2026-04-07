# TestCase2RPG

Single-project React + TypeScript + Vite application that converts natural-language RPG test descriptions into executable RPGLE test code using DeepSeek in explicit multi-stage processing.

## Workflow Stages
1. Parse Description
2. Generate Structured Test Case
3. Generate RPG Code
4. Final Output + Download

## Tech Stack
- React + TypeScript + Vite
- TailwindCSS
- Zustand
- DeepSeek API

## Run
```bash
npm install
cp .env.example .env
npm run dev
```

## Example Natural Language Input
```text
Test the customer inquiry program CUSTINQ.
If customer ID 123456 exists in CUSTOMER table with balance 1000, the program should return status OK and balance 1000.
If customer ID 999999 does not exist, the program should return NOT_FOUND.
Clean up test data after execution.
```

## Example Structured JSON
```json
{
  "program": "CUSTINQ",
  "testCases": [
    {
      "id": "TC001",
      "description": "Existing customer should return status OK and correct balance",
      "input": {
        "customerId": "123456"
      },
      "expected": {
        "status": "OK",
        "balance": 1000
      },
      "dbSetup": [
        "insert into CUSTOMER (ID, BALANCE) values ('123456', 1000)"
      ],
      "cleanup": [
        "delete from CUSTOMER where ID = '123456'"
      ]
    }
  ]
}
```

## Example Generated RPGLE
```rpgle
**FREE
ctl-opt dftactgrp(*no);

dcl-proc RunTests;
   exsr TC001;
end-proc;

begsr TC001;
   exec sql insert into CUSTOMER (ID, BALANCE) values ('123456', 1000);
   callp CUSTINQ();
   if status = 'OK' and balance = 1000;
      dsply ('PASS TC001');
   else;
      dsply ('FAIL TC001');
   endif;
   exec sql delete from CUSTOMER where ID = '123456';
endsr;
```
