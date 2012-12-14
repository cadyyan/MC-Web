from django.contrib import messages

def addMessage(request, type, message):
    messages.add_message(request, type, message)
    
def addInfoMessage(request, message):
    addMessage(request, messages.INFO, message)

def addSuccessMessage(request, message):
    addMessage(request, messages.SUCCESS, message)

def addWarningMessage(request, message):
    addMessage(request, messages.WARNING, message)

def addErrorMessage(request, message):
    addMessage(request, messages.ERROR, message)
