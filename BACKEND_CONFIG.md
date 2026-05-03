# Guia de Configuração do Backend para Aplicação Mobile

## 🔧 Configurações Necessárias no Laravel

### 1. CORS (Cross-Origin Resource Sharing)

Verifique se o arquivo `config/cors.php` está configurado corretamente:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => [
    'http://localhost:3000',     // Desenvolvimento
    'http://localhost:3001',     // Alternativo
    'http://192.168.1.*',        // Rede local (testing)
    'https://suaapp.com',        // Produção
],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

### 2. Sanctum (Autenticação)

Verifique `config/sanctum.php`:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:3000,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort(),
    env('FRONTEND_URL') ? ','.parse_url(env('FRONTEND_URL'), PHP_URL_HOST) : ''
))),

'guard' => ['web'],
'expiration' => null,
```

No `.env`:
```
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:3001
```

---

## 📱 Endpoints Obrigatórios para o Mobile

### 1. Autenticação (Já Implementado ✅)

```php
// routes/api.php

Route::prefix('drivers')->group(function () {
    Route::post('/login', [DriverAuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [DriverAuthController::class, 'me']);
        Route::post('/logout', [DriverAuthController::class, 'logout']);
        Route::post('/logout-all', [DriverAuthController::class, 'logoutAll']);
    });
});
```

### 2. Rotas (Já Implementado ✅)

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('routes', RouteController::class)->only(['index', 'show']);
});
```

**Importante**: Filtrar rotas por `driver_id` no controller:

```php
class RouteController extends Controller
{
    public function index()
    {
        // Retornar rotas do motorista autenticado OU todas as rotas
        $routes = Route::where('driver_id', auth()->user()->id)
                       ->orWhereNull('driver_id')
                       ->get();
        
        return response()->json(['data' => $routes]);
    }
    
    public function show($id)
    {
        $route = Route::findOrFail($id);
        
        // Verificar se o motorista tem permissão
        if ($route->driver_id && $route->driver_id !== auth()->user()->id) {
            abort(403, 'Unauthorized');
        }
        
        return response()->json(['data' => $route]);
    }
}
```

### 3. Despesas/Gastos (Já Implementado ✅)

```php
Route::middleware('auth:sanctum')->prefix('drivers')->group(function () {
    Route::get('/expenses', [DriverExpensesController::class, 'index']);
    Route::post('/expenses', [DriverExpensesController::class, 'store']);
    Route::get('/expenses/{id}', [DriverExpensesController::class, 'show']);
    Route::get('/expenses-monthly-total', [DriverExpensesController::class, 'monthlyTotal']);
});
```

**Controller (DriverExpensesController.php):**

```php
<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DriverExpensesController extends Controller
{
    public function index()
    {
        $driver = Auth::user(); // Motorista autenticado
        
        $expenses = Expense::where('driver_id', $driver->id)
                           ->orderBy('created_at', 'desc')
                           ->get();
        
        return response()->json(['data' => $expenses]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_plate' => 'required|string|max:8',
            'value' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'proof_of_payment' => 'nullable|string', // base64 ou URL
        ]);
        
        $driver = Auth::user();
        
        $expense = Expense::create([
            'driver_id' => $driver->id,
            'vehicle_plate' => $validated['vehicle_plate'],
            'value' => $validated['value'],
            'description' => $validated['description'] ?? null,
            'proof_of_payment' => $validated['proof_of_payment'] ?? null,
        ]);
        
        return response()->json([
            'message' => 'Despesa cadastrada com sucesso',
            'data' => $expense,
        ], 201);
    }
    
    public function show($id)
    {
        $driver = Auth::user();
        $expense = Expense::findOrFail($id);
        
        if ($expense->driver_id !== $driver->id) {
            abort(403, 'Unauthorized');
        }
        
        return response()->json(['data' => $expense]);
    }
    
    public function monthlyTotal()
    {
        $driver = Auth::user();
        $now = now();
        
        $total = Expense::where('driver_id', $driver->id)
                        ->whereYear('created_at', $now->year)
                        ->whereMonth('created_at', $now->month)
                        ->sum('value');
        
        return response()->json([
            'month' => $now->format('m'),
            'year' => $now->format('Y'),
            'total' => $total,
        ]);
    }
}
```

---

## 📞 Notificações (Novo - Implementar)

### Migration para Notificações

```php
// database/migrations/YYYY_MM_DD_HHMMSS_create_notifications_table.php

Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('driver_id');
    $table->unsignedBigInteger('route_id');
    $table->string('type');
    $table->text('message');
    $table->boolean('read')->default(false);
    $table->timestamp('read_at')->nullable();
    $table->timestamps();
    
    $table->foreign('driver_id')->references('id')->on('drivers')->onDelete('cascade');
    $table->foreign('route_id')->references('id')->on('routes')->onDelete('cascade');
});
```

### Model (app/Models/Notification.php)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'driver_id',
        'route_id',
        'type',
        'message',
        'read',
        'read_at',
    ];
    
    protected $casts = [
        'read' => 'boolean',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    public function driver()
    {
        return $this->belongsTo(Drivers::class);
    }
    
    public function route()
    {
        return $this->belongsTo(Route::class);
    }
}
```

### Controller (app/Http/Controllers/NotificationsController.php)

```php
<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'message' => 'required|string',
            'route_id' => 'required|exists:routes,id',
        ]);
        
        $driver = Auth::user();
        
        // Verificar se a rota pertence ao motorista
        $route = \App\Models\Route::findOrFail($validated['route_id']);
        if ($route->driver_id !== $driver->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $notification = Notification::create([
            'driver_id' => $driver->id,
            'route_id' => $validated['route_id'],
            'type' => $validated['type'],
            'message' => $validated['message'],
        ]);
        
        return response()->json([
            'message' => 'Notificação enviada com sucesso',
            'data' => $notification,
        ], 201);
    }
    
    public function index()
    {
        $driver = Auth::user();
        
        $notifications = Notification::where('driver_id', $driver->id)
                                     ->orderBy('created_at', 'desc')
                                     ->get();
        
        return response()->json(['data' => $notifications]);
    }
    
    public function show($id)
    {
        $driver = Auth::user();
        $notification = Notification::findOrFail($id);
        
        if ($notification->driver_id !== $driver->id) {
            abort(403, 'Unauthorized');
        }
        
        return response()->json(['data' => $notification]);
    }
    
    public function markAsRead($id)
    {
        $driver = Auth::user();
        $notification = Notification::findOrFail($id);
        
        if ($notification->driver_id !== $driver->id) {
            abort(403, 'Unauthorized');
        }
        
        $notification->update([
            'read' => true,
            'read_at' => now(),
        ]);
        
        return response()->json(['message' => 'Notification marked as read']);
    }
}
```

### Routes (routes/api.php)

```php
Route::middleware('auth:sanctum')->prefix('drivers')->group(function () {
    // ... outros endpoints ...
    
    Route::post('/notifications', [NotificationsController::class, 'store']);
    Route::get('/notifications', [NotificationsController::class, 'index']);
    Route::get('/notifications/{id}', [NotificationsController::class, 'show']);
    Route::put('/notifications/{id}/read', [NotificationsController::class, 'markAsRead']);
});
```

---

## 🧪 Testando a API

### Com Postman ou cURL

#### 1. Login
```bash
curl -X POST http://localhost:8000/api/drivers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "motorista@example.com",
    "password": "senha123"
  }'
```

#### 2. Listar Rotas (usando token)
```bash
curl -X GET http://localhost:8000/api/routes \
  -H "Authorization: Bearer TOKEN_AQUI"
```

#### 3. Cadastrar Despesa
```bash
curl -X POST http://localhost:8000/api/drivers/expenses \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_plate": "ABC-1234",
    "value": 150.50,
    "description": "Combustível"
  }'
```

---

## 📊 Modelo de Dados Esperado

### Drivers
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "license_number": "12345678900",
  "phone_number": "11999999999",
  "created_at": "2026-02-23T12:43:39.000000Z",
  "updated_at": "2026-02-23T12:43:39.000000Z"
}
```

### Routes
```json
{
  "id": 1,
  "name": "Rota 1",
  "start_point": "Centro",
  "end_point": "Escola Municipal",
  "start_time": "07:10:00",
  "end_time": "08:30:00",
  "distance": 12.5,
  "driver_id": 1,
  "vehicle_id": 1,
  "created_at": "2026-02-23T12:43:39.000000Z"
}
```

### Expenses
```json
{
  "id": 1,
  "driver_id": 1,
  "vehicle_plate": "ABC-1234",
  "value": 150.50,
  "description": "Combustível",
  "proof_of_payment": null,
  "created_at": "2026-02-26T10:30:00.000000Z"
}
```

---

## ✅ Checklist de Implementação

- [x] CORS configurado
- [x] Sanctum autenticação
- [x] Endpoints de autenticação do motorista
- [x] Endpoints de rotas filtradas
- [x] Endpoints de despesas
- [ ] Endpoints de notificações
- [ ] Testes de integração
- [ ] Documentação de erro (status codes)

---

## 🚨 Tratamento de Erros

O backend deve retornar erros estruturados:

```json
{
  "message": "Erro descritivo",
  "errors": {
    "field_name": ["Erro específico do campo"]
  }
}
```

**Status Codes Esperados:**
- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Validação falhou
- `401`: Não autenticado (token inválido/expirado)
- `403`: Não autorizado (sem permissão)
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor

---

**Data**: 02/05/2026
**Versão**: 1.0
