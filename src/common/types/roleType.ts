export interface Role {
  id: number;
  name: string;
  description?: string;
  is_editable: string;
  permissions: string[];
}

export interface RolePayload {
  name: string;
  description?: string;
  permissions: string[];
}

export interface Permission {
  id: number;
  name: string;
}
