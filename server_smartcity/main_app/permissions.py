from rest_framework import permissions

class IsOwnerAndDraftOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        
        if request.method in permissions.SAFE_METHODS:
            return True

        hasil = obj.reporter == request.user and obj.status == 'DRAFT'
        return hasil