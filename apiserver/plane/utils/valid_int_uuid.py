# Python imports
import uuid


def is_int_or_uuid(value):
    # Check if the value can be converted to an integer
    try:
        int_value = int(value)
        return "int", int_value
    except ValueError:
        pass

    # Check if the value can be converted to a UUID
    try:
        uuid_value = uuid.UUID(str(value))
        return "uuid", uuid_value
    except ValueError:
        pass

    return "", None