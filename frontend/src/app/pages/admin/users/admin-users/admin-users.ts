import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in">
        <h2 class="text-2xl font-bold text-white">User Management</h2>

        <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <table class="w-full text-left">
            <thead class="bg-black/40 text-gray-400 uppercase text-xs font-semibold tracking-wider">
                <tr>
                    <th class="px-6 py-4">Name</th>
                    <th class="px-6 py-4">Email</th>
                    <th class="px-6 py-4">Role</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
                <tr *ngFor="let user of users" class="hover:bg-gray-800/50 transition">
                    <td class="px-6 py-4 font-medium text-white">{{user.name}}</td>
                    <td class="px-6 py-4 text-gray-400">{{user.email}}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded text-xs font-bold"
                            [class.bg-purple-500_10]="user.role === 'admin'"
                            [class.text-purple-400]="user.role === 'admin'"
                            [class.bg-blue-500_10]="user.role === 'user'"
                            [class.text-blue-400]="user.role === 'user'">
                            {{user.role | uppercase}}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded text-xs font-bold"
                             [class.bg-red-500_10]="user.isBlocked"
                             [class.text-red-500]="user.isBlocked"
                             [class.bg-green-500_10]="!user.isBlocked"
                             [class.text-green-500]="!user.isBlocked">
                             {{user.isBlocked ? 'BLOCKED' : 'ACTIVE'}}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right space-x-2">
                        <button (click)="toggleBlock(user)" class="text-xs border border-gray-700 hover:bg-white/5 px-2 py-1 rounded transition text-gray-300">
                            {{user.isBlocked ? 'Unblock' : 'Block'}}
                        </button>
                        <button *ngIf="user.role !== 'admin'" (click)="makeAdmin(user)" class="text-xs text-purple-400 hover:text-purple-300 transition font-medium">
                            Make Admin
                        </button>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe((data) => this.users = data);
  }

  toggleBlock(user: any) {
    if (confirm(`Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} ${user.name}?`)) {
      this.adminService.toggleBlockUser(user._id).subscribe(() => this.loadUsers());
    }
  }

  makeAdmin(user: any) {
    if (confirm(`Promote ${user.name} to Admin?`)) {
      this.adminService.updateUserRole(user._id, 'admin').subscribe(() => this.loadUsers());
    }
  }
}
