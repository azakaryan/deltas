import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModelDetailsComponent } from "./model-details.component";
import { ModelDetailsRoutingModule } from "./model-details-routing.module";
import { EntitiesComponent } from "./components/entities/entities.component";
import { AssociationsComponent } from "./components/associations/associations.component";
import { AssociationDetailsComponent } from "./components/association-details/association-details.component";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSelectModule } from "@angular/material/select";
import { EntitiesService } from "./services/entities.service";
import { EntityDetailsComponent } from "./components/entity-details/entity-details.component";
import { AttributesComponent } from "./components/attributes/attributes.component";
import { AttributeDetailsComponent } from "./components/attribute-details/attribute-details.component";
import {ModelDetailsFormService} from "./services/model-details-form.service";

@NgModule({
  declarations: [
    ModelDetailsComponent,
    EntitiesComponent,
    EntityDetailsComponent,
    AssociationsComponent,
    AssociationDetailsComponent,
    AttributesComponent,
    AttributeDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModelDetailsRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSelectModule,
  ],
  providers: [
    EntitiesService,
    ModelDetailsFormService,
  ],
})
export class ModelDetailsModule { }
